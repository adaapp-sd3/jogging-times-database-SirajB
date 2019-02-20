// var fs = require('fs')
// var SQL = require('sql.js')

// open a database
// var filebuffer = fs.readFileSync('./database.sqlite')
// var db = new SQL.Database(filebuffer)

const sqlite = require("better-sqlite3");

const db = sqlite("./database.sqlite")

// export the database so we can use it elsewhere
module.exports = db
