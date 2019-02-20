const db = require("../database");


const insertJogs = db.prepare(
  "INSERT INTO jogs (date, duration, distance, user_id) VALUES (?, ?, ?, ?)"
);

const selectJoggings = db.prepare("SELECT * FROM jogs WHERE id = ?");
const selectJoggingUser = db.prepare("SELECT * FROM jogs WHERE user_id = ?");
const updateJogging = db.prepare(
  "UPDATE jogs SET date = ?, distance = ?, duration = ?  WHERE id = ?"
);
const deleteTime = db.prepare("DELETE FROM jogs WHERE id = ?");
const deleteAccount = db.prepare("DELETE FROM jogs WHERE user_id = ?");

class Jogging {
  static insert(date, duration, distance, user_id) {
    
    const info = insertJogs.run(date, distance, duration, user_id);

    
    const joggingId = info.lastInsertRowid;

    return joggingId;
  }
  static updateJogging(date, distance, duration, id) {
    updateJogging.run(date, distance, duration, id);
  }
  static deleteTime(id) {
    deleteTime.run(id);
  }
  static findById(id) {
    const row = selectJoggings.get(id);

    if (row) {
      return new Jogging (row);
    } else {
      return null;
    }
  }
  static findByUser(id) {
    const row = selectJoggingUser.get(id);

    if (row) {
      return new Jog(row);
    } else {
      return null;
    }
  }
  static findAllFromUser(id) {
    const allJoggings = selectJoggingUser.all(id);
    return allJoggings;
  }

  static deleteAccount(id) {
    deleteAccount.run(id);
  }

  constructor(databaseJoggingsRow) {
    this.id = databaseJoggingsRow.id;
    this.distance = databaseJoggingsRow.distance;
    this.duration = databaseJoggingsRow.duration;
  }
}

module.exports = Jogging;