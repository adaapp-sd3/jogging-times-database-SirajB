var db = require('../database')

// get the queries ready - note the ? placeholders
var insertFollowing = db.prepare('INSERT INTO following (followee_id, follower_id) VALUES (?, ?)')
var selectUser = db.prepare('SELECT id FROM user WHERE name = ?')
var selectFollowee = db.prepare('SELECT * FROM following INNER JOIN user ON user.id = following.followee_id WHERE following.follower_id = ?')
var countFollowOfTarget = db.prepare('SELECT count(*) FROM following WHERE followee_id = ? AND follower_id = ?')

class Following {
    static insert(followee_id, follower_id) {
        // run the insert query
        if(followee_id == follower_id){
            // popup.alert({
            //     content: "girl you really tryna follow yourself? really? that's a bit sad sis"
            // })
            return
        }
        var count = countFollowOfTarget.get(followee_id, follower_id)
        let value = count['count(*)']

        if(value < 1) {
            var info = insertFollowing.run(followee_id, follower_id)
            // check what the newly inserted row id is
            var followingId = info.lastInsertRowid
        }
        return followingId
    }

    static findAllFromUser(follower_id){
        var allFollowees = selectFollowee.all(follower_id)
        return allFollowees
    }

    static findByName(name) {
        var id = selectUser.get(name)
       // console.log("USERS ID IS ....", id)
        return id
    }

    constructor(databaseRow) {
        this.followee_id = databaseRow.followee_id
        this.follower_id = databaseRow.follower_id


    }
}

module.exports = Following
