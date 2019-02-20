const db = require("../database");

// get the queries ready - note the ? placeholders
const insertUser = db.prepare(
  "INSERT INTO user (name, email, password_hash) VALUES (?, ?, ?)"
);

const selectById = db.prepare("SELECT * FROM user WHERE id = ?");
const selectByEmail = db.prepare("SELECT * FROM user WHERE email = ?");
const deleteAccount = db.prepare("DELETE FROM user WHERE id = ?");

class User {
  static insert(name, email, passwordHash) {

    const info = insertUser.run(name, email, passwordHash);


    const userId = info.lastInsertRowid;

    return userId;
  }

  static findById(id) {
    const row = selectById.get(id);

    if (row) {
      return new User(row);
    } else {
      return null;
    }
  }

  static findByEmail(email) {
    const row = selectByEmail.get(email);
    if (row) {
      return new User(row);
    } else {
      return null;
    }
  }

  static deleteAccount(id) {
    deleteAccount.run(id);
  }

  constructor(databaseRow) {
    this.id = databaseRow.id;
    this.name = databaseRow.name;
    this.email = databaseRow.email;
    this.passwordHash = databaseRow.password_hash;
  }
}

module.exports = User;