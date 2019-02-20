const db = require('../database')

// get the queries ready - note the ? placeholders
const insertJog = db.prepare('INSERT INTO jog (user_id, date, distance, duration) VALUES (?, ?, ?, ?)')
const selectJog = db.prepare('SELECT * FROM jog WHERE id = ?')
const selectJogUser = db.prepare('SELECT * FROM jog WHERE user_id = ?')
const updateJog = db.prepare('UPDATE jog SET date = ?, distance = ?, duration = ?  WHERE id = ?')
const deleteTime = db.prepare ('DELETE FROM jog WHERE id = ?')

class Jogging {
    static insert(user_id, date, distance, duration) {
        // run the insert query
        const info = insertJog.run(user_id, date, distance, duration)
        // check what the newly inserted row id is
        const jogId = info.lastInsertRowid
        return jogId
    }

    static updateJogById(date, distance ,duration, id){
        updateJog.run(date, distance, duration, id)
    }


    static deleteTimeById(id){
        deleteTime.run(id)
    }



    static findById(id) {
        const row = selectJog.get(id)

        if (row) {
            return new Jogging(row)
        } else {
            return null
        }
    }

    static findByUser(id) {
        const row = selectJogUser.get(id)

        if (row) {
            return new Jogging(row)
        } else {
            return null
        }
    }

    static findAllFromUser(id){
        const allJogs = selectJogUser.all(id)
        return allJogs

    }

    constructor(databaseRow) {
        this.user_id = databaseRow.user_id
        this.date = databaseRow.date
        this.distance = databaseRow.distance
        this.duration = databaseRow.duration


    }
}

module.exports = Jogging
