const SQLite = require("better-sqlite3");
const sql = SQLite('./.data/global-data.db'); 
const warapi = require('./warapi.js');

// DO OTHER INIT STUFF
warapi.pullStatic();
warapi.updateMap();

exports.cunt = function test(string){
console.log("One-time command module "+string);
}
