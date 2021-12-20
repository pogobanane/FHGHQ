const SQLite = require('better-sqlite3');
const fs = require('fs');

if (!fs.existsSync('./.data')) {
  throw 'Folder for SQLite database does not exist: ./.data';
}

const sql = SQLite('./.data/global-data.db');

function sqlinit(sqlstatement, expected_error) {
  var ran = true;
  try {
    sql.prepare(sqlstatement).run();
  } catch (err) {
    // already inited or other error
    if (!err.message.includes(expected_error)) {
      throw err;
    }
    ran = false;
  }
  if (ran) {
    console.warn('SQLite db not inited. Executed: ' + sqlstatement);
  }
}

////SQL MANAGEMENT
sqlinit(
  'CREATE TABLE global (id TEXT PRIMARY KEY, admin TEXT, settings TEXT, techtree TEXT, fobs TEXT, requests TEXT, misc TEXT, arty TEXT, squads TEXT, refinery TEXT, production TEXT, storage TEXT, stockpiles TEXT, logi TEXT, events TEXT);',
  'table global already exists'
);
sqlinit(
  'CREATE TABLE userglobal (id TEXT PRIMARY KEY, userid TEXT, globalid TEXT, rank INT, role INT, FOREIGN KEY (userid) REFERENCES users(id), FOREIGN KEY (globalid) REFERENCES global(id));',
  'table userglobal already exists'
);
sqlinit(
  'CREATE TABLE events (region INT, date TEXT, prevItem TEXT, newItem TEXT);',
  'table events already exists'
);
sqlinit(
  'CREATE TABLE users (id TEXT PRIMARY KEY, salt TEXT, name TEXT, avatar TEXT);',
  'table users already exists'
);
sqlinit(
  'INSERT INTO users (id, salt, name, avatar) VALUES ("anonymous","anonymous","anonymous","anonymous");',
  'UNIQUE constraint failed'
);

//You should have gone for the HEAD
//NO
//sql.prepare("DROP TABLE userglobal;").run();
//sql.prepare("DROP TABLE users;").run();
//sql.prepare("DROP TABLE global;").run();
//sql.prepare("CREATE TABLE warhistory (warnumber INT, warstats TEXT, events TEXT, reports TEXT, startpoint TEXT);").run();
// exports.wipe = function (){
// sql.prepare("DELETE FROM userglobal;").run();
// sql.prepare("DELETE FROM global;").run();
//sql.prepare("DELETE FROM towns;").run();
//sql.prepare("DELETE FROM forts;").run();
//sql.prepare("DELETE FROM fobs;").run();
//sql.prepare("DELETE FROM ambushes;").run();
//sql.prepare("DELETE FROM requests;").run();
//sql.prepare("DELETE FROM techtrees;").run();
//sql.prepare("DELETE FROM mines;").run();
// }
