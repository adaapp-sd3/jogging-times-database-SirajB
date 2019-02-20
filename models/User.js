const db = require('../database')

// get the queries ready - note the ? placeholders
const insertUser = db.prepare('INSERT INTO user (name, email, password_hash) VALUES (?, ?, ?)')
const selectUser = db.prepare('SELECT * FROM user WHERE id = ?')
const selectUserEmail = db.prepare('SELECT * FROM user WHERE email = ?')
const deleteAccount = db.prepare('DELETE FROM user WHERE id = ?')
const selectUserName = db.prepare('SELECT name, id FROM user WHERE name = ?')

class User {
  static insert(name, email, password_hash) {
    // run the insert query
    const info = insertUser.run(name, email, password_hash)

    // check what the newly inserted row id is
    const userId = info.lastInsertRowid

    return userId
  }

  static deleteAccountById(id){
    deleteAccount.run(id)
  }

  static selectUserByName(name){
    return selectUserName.get(name)
  }

  static findById(id) {
    const row = selectUser.get(id)

    if (row) {
      return new User(row)
    } else {
      return null
    }
  }

  static findByEmail(email) {
    const row = selectUserEmail.get(email)

    if (row) {
      return new User(row)
    } else {
      return null
    }
  }

  constructor(databaseRow) {
    this.id = databaseRow.id
    this.name = databaseRow.name
    this.email = databaseRow.email
    this.password_hash = databaseRow.password_hash
  }
}

module.exports = User
