// server.js
// where your node app starts
require('dotenv').config();

// init db
const _touchtables = require('./createtables.js');

// init project
const express = require('express');
const app = express();
const http = require('http').Server(app);
const session = require('express-session');
const passport = require('passport');
const shortid = require('shortid');
const SteamStrategy = require('passport-steam').Strategy;

// OTHER SERVER MODULES MADE BY US
const socket = require('./socket.js');
const warapi = require('./warapi.js');
const db = require('./dbfunctions.js');
const onetimers = require('./onetimers.js');
// const discordbot = require('./discordbot.js');// SHUTDOWN UNTIL FURTHER NOTICE

const apikey = process.env.KEY;

// warapi.updateMap();
// warapi.pullStatic();
// warapi.updateStaticTowns();


http.listen(3000, '0.0.0.0', () => {
  console.log('Your app is listening on port 3000');
});
// exports.listener = listener;
app.use(express.static('src'));
socket.import(http);

// //STEAM AUTH AREA
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new SteamStrategy({
  returnURL: `${process.env.LINK}auth/steam/return`,
  realm: process.env.LINK,
  apiKey: apikey,
},
((identifier, profile, done) => {
  // asynchronous verification, for effect...
  process.nextTick(() => {
    profile.identifier = identifier;
    return done(null, profile);
  });
})));

app.use(session({
  secret: 'your secret',
  name: 'name of session id',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(`${__dirname}/../../src`));

app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  });

app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  (req, res) => {
    let salt = shortid.generate();
    // console.log("User "+req.user._json.steamid+" "+req.user._json.personaname+" has logged on");
    // discordbot.auth(req.user._json.steamid,req.user._json.personaname);
    if (!db.existscheck(req.user._json.steamid)) {
      db.insertuser.run(req.user._json.steamid, salt, req.user._json.personaname, req.user._json.avatarmedium);
    } else {
      salt = db.getaccount(req.user._json.steamid).salt;
      db.updateuser.run(req.user._json.personaname, req.user._json.avatarmedium, req.user._json.steamid);
    }
    // res.clearCookie('')
    res.cookie('steamid', req.user._json.steamid);
    res.cookie('salt', salt);
    if (req.headers.cookie == undefined) {
      res.redirect('/');
    } else if (!req.headers.cookie.includes('redir_room')) {
      res.redirect('/');
    } else {
      const cookiestring = req.headers.cookie;
      const id = cookiestring.substring(cookiestring.indexOf(' redir_room') + 12, cookiestring.indexOf(' redir_room') + 21);
      res.redirect(`/room/${id}`);
    }
  });
app.post('/noauth', (req, res) => {
  const idsalt = shortid.generate().slice(0, 8);
  const salt = shortid.generate();
  db.insertuser.run(`anonymous${idsalt}`, salt, req.query.name, new Date().toString());
  res.cookie('steamid', `anonymous${idsalt}`);
  res.cookie('salt', salt);
  // console.log("Anonymous login",idsalt)
  if (req.headers.cookie == undefined) {
    res.send({ redir: false });
    // res.redirect('/');
  } else if (!req.headers.cookie.includes('redir_room')) {
    res.send({ redir: false });
    // res.redirect('/');
  } else {
    // console.log("redirecting noauth")
    const cookiestring = req.headers.cookie;
    const id = cookiestring.substring(cookiestring.indexOf(' redir_room') + 12, cookiestring.indexOf(' redir_room') + 21);
    // console.log("redir room",id)
    res.send({ redir: true, redirId: id });
    // res.redirect('/room/'+id);
  }
});
// app.listen(3000);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}
// //STEAM AUTH AREA ENDS
// About
app.get('/about', (request, response) => {
  if (db.logincheck(request)) {
    response.sendFile(`${__dirname}/views/about.html`);
  } else {
    response.redirect('/auth');
  }
});
// Profile page
app.get('/', (request, response) => {
  if (db.logincheck(request)) {
    response.sendFile(`${__dirname}/views/index.html`);
  } else { response.redirect('/auth'); }
});

// Get users profile from the DB
app.post('/getprofile', (request, response) => {
  if (db.logincheck(request)) {
    const { id } = request.query;
    const account = db.getaccount(id);
    // console.log(id)
    // console.log(request.query);
    const packet = {
      name: account.id, name: account.name, blueprint: account.blueprint, avatar: account.avatar,
    };
    // console.log(packet);
    response.send(packet);
  } else { response.redirect('/auth'); }
});

// Get info on rooms connected to a profile
app.post('/getuserrooms', (request, response) => {
  const rooms = db.getrooms(request.query.id);
  response.send(rooms);
});

// Leave a room from profile page
app.post('/leaveroom', (request, response) => {
  if (db.logincheck(request)) {
    const account = parsecookies(request);
    const { globalid } = request.query;
    const roominfo = db.getroominfo(request.query.globalid);
    if (account.id != roominfo.adminid) {
      const packet = { globalid, userid: account.id };
      socket.emitleaveroom(packet);
    }
    db.leaveroom(account.id, globalid);
    response.redirect('/');
  }
});

// Authorization page
app.get('/auth', (request, response) => {
  response.sendFile(`${__dirname}/views/auth.html`);
});


// Request page for a room - get link
app.get('/request/:id', (request, response) => {
  if (db.logincheck(request)) {
    response.sendFile(`${__dirname}/views/request.html`);
  } else {
    response.redirect('/auth');
  }
});

// Request page, part 2 - return user status in the room
app.post('/request2', (request, response) => {
  const globalid = request.query.id;
  const account = parsecookies(request);
  const rank = db.getmembership(account.id, globalid);
  const roominfo = db.getroominfo(globalid);
  // console.log(roominfo);
  if (!roominfo) {
    var packet = { rank: 8 };
    // console.log(packet);
    response.send(packet);
  } else {
    const settings = JSON.parse(roominfo.settings);
    var packet = {
      rank, roomname: settings.name, secure: settings.secure, admin: roominfo.adminname, adminid: roominfo.adminid,
    };
    // console.log(packet);
    response.send(packet);
  }
});

// Request page, part 3 - submit access request
app.post('/request3', (request, response) => {
  const { globalid } = request.query;
  const account = parsecookies(request);
  const rank = db.getmembership(account.id, globalid);
  // console.log(rank);
  if (rank == 8) {
    response.redirect('/');
  }
  if (rank == 7) {
    db.insertrelation.run(account.id + globalid, account.id, globalid, 5);
    const packet = { globalid, userid: account.id };
    socket.emitaccessrequest(packet);
    // discordbot.requestaccess(account.id,globalid);
    response.redirect('/');
  }
});

// Request unsecure page - submit password
app.post('/requestPassword', (request, response) => {
  const { globalid } = request.query;
  const account = parsecookies(request);
  // console.log(request.originalUrl);
  const check = db.checkpassword(globalid, request.query.password);
  if (check) {
    db.insertrelation.run(account.id + globalid, account.id, globalid, 3);
    response.send('right');
  } else {
    response.send('wrong');
  }
});

// Creates a room
app.post('/createroom', (request, response) => {
  const id = shortid.generate();
  const admin = request.query.id;
  const { settings } = request.query;
  db.createroom(id, admin, settings);
  response.send(id);
});

// Pulls room from a unique link
app.get('/room/:id', (request, response) => {
  // console.log(request.headers['cookie'] )
  // var order = db.get('orders').find({ id: request.params.id}).value();
  if (db.logincheck(request)) {
    const account = parsecookies(request);
    const rank = db.getmembership(account.id, request.params.id);
    if (rank < 4) {
      response.sendFile(`${__dirname}/views/global.html`);
    }
    if (rank >= 4) {
      response.redirect(`/request/${request.params.id}`);
    }
  } else {
    response.cookie('redir_room', request.params.id);
    response.redirect('/auth');
  }
});


// pulls room from a unique link, part 2
app.post('/getroom', (request, response) => {
  const packet = {};
  packet.users = db.getroomusers(request.query.id);
  packet.meta = db.getroominfo(request.query.id);
  packet.meta.settings = JSON.parse(packet.meta.settings);
  packet.dynamic = db.getdynamic();
  packet.static = db.getstatic();
  packet.private = db.getprivateroominfo(request.query.id);
  packet.events = db.getallevents(request.query.id);
  packet.stats = { totalplayers: socket.totalplayers };
  response.send(packet);
});

app.get('/getcurrentwar', (request, response) => {
  const packet = {
    totalplayers: socket.totalplayers, warstats: socket.warstats, wr: warapi.WR, currentwar: socket.currentwar,
  };
  response.send(packet);
});

// Pulls room from a unique link
app.get('/getwar/:warnumber', (request, response) => {
  const war = db.GetWar(request.params.warnumber);
  response.send(war);
});

// Get account data from cookies
function parsecookies(request) {
  if (request.headers.cookie == undefined) { return false; }
  if (!request.headers.cookie.includes('salt')) { return false; }
  const cookiestring = request.headers.cookie;
  const id = cookiestring.substring(cookiestring.indexOf(' steamid=') + 9, cookiestring.indexOf(' steamid=') + 26).replace(';', '');
  const salt = cookiestring.substring(cookiestring.indexOf(' salt=') + 6, cookiestring.indexOf(' salt=') + 15).replace(';', '');
  const result = { id, salt };
  return result;
}

// onetimers.wipe();
// discordbot.cunt("loaded");
onetimers.cunt('loaded');
db.cunt('loaded');
warapi.cunt('loaded');
socket.cunt('loaded');


function patch() {
  warapi.updateMap();
  warapi.pullStatic();
  warapi.updateStaticTowns();
}

//patch();
