const express = require('express')
const bcrypt = require('bcryptjs')

const user = require('./models/User')
const jogging = require('./models/Jogging')
const following = require('./models/Following')

const routes = new express.Router()

const saltRounds = 10

function formatDateForHTML(date) {
    return new Date(date).toISOString().slice(0, -8)
}

// main page
routes.get('/', (req, res) => {
    if (req.cookies.userId) {
        // if we've got a user id, assume we're logged in and redirect to the app:
        res.redirect('/times')
    } else {
        // otherwise, redirect to login
        res.redirect('/sign-in')
    }
})


// show the create account page
routes.get('/create-account', (req, res) => {
    res.render('create-account.html')
})

// handle create account forms:
routes.post('/create-account', (req, res) => {
    const form = req.body

    // TODO: add some validation in here to check
    console.log('create user', form)

    // hash the password - we dont want to store it directly
    const passwordHash = bcrypt.hashSync(form.password, saltRounds)

    // create the user
    const userId = user.insert(form.name, form.email, passwordHash)

    // set the userId as a cookie
    res.cookie('userId', userId)

    // redirect to the logged in page
    res.redirect('/times')
})

// show the sign-in page
routes.get('/sign-in', (req, res) => {
    res.render('sign-in.html')
})

routes.post('/sign-in', (req, res) => {
    const form = req.body

    // find the user that's trying to log in
    const user = user.findByEmail(form.email)

    // if the user exists...
    if (user) {
        console.log({ form, user })
        if (bcrypt.compareSync(form.password, user.password_hash)) {
            // the hashes match! set the log in cookie
            res.cookie('userId', user.id)
            // redirect to main app:
            res.redirect('/times')
        } else {
            // if the username and password don't match, say so
            res.render('sign-in.html', {
                errorMessage: 'Email address and password do not match'
            })
        }
    } else {
        // if the user doesnt exist, say so
        res.render('sign-in.html', {
            errorMessage: 'No user with that email exists'
        })
    }
})

// handle signing out
routes.get('/sign-out', (req, res) => {
    // clear the user id cookie
    res.clearCookie('userId')

    // redirect to the login screen
    res.redirect('/sign-in')
})

//handle deleting account
routes.get('/delete-account', (req, res) =>{
    const accountId = req.cookies.userId
    console.log('delete user', accountId)
    user.deleteAccountById(accountId)
    res.redirect('/sign-in')
})

// list all jog times
routes.get('/times', (req, res) => {
    let loggedInUser = user.findById(req.cookies.userId)

    let addAll = (accumulator, currentValue) => accumulator + currentValue;

    // fake stats - TODO: get real stats from the database->DONE(?)
    let totalDistance = (jogging.findAllFromUser(req.cookies.userId)).map(jog => {
        return jog.distance
    })
        .reduce(addAll, 0)

    let totalTime = (jogging.findAllFromUser(req.cookies.userId)).map(jog => {
        return jog.duration
    })
        .reduce(addAll, 0)

    let avgSpeed = 0
    if (totalDistance > 0 && totalTime > 0 ){
        avgSpeed = totalDistance / totalTime
    }


    let allJogs = jogging.findAllFromUser(req.cookies.userId)

    allJogs.map(obj => {
        obj.avgSpeed = obj.distance/obj.duration;
        return obj;
    })

    res.render('list-times.html', {
        user: loggedInUser,
        stats: {
            totalDistance: totalDistance.toFixed(2),
            totalTime: totalTime.toFixed(2),
            avgSpeed: avgSpeed.toFixed(2)
        },

        // fake times: TODO: get the real jog times from the db->DONE(?)

        times: allJogs

    })
})



// show the create time form
routes.get('/times/new', (req, res) => {
    // this is hugely insecure. why?
    const loggedInUser = user.findById(req.cookies.userId)

    res.render('create-time.html', {
        user: loggedInUser
    })
})

// handle the create time form
routes.post('/times/new', (req, res) => {
    const form = req.body

    console.log('create time', form)

    // TODO: save the new time ->DONE(?)

    const newJog = jogging.insert(req.cookies.userId, form.startTime, form.distance, form.duration)


    res.redirect('/times')
})



//show start following page
routes.get('/start-following', (req, res) =>{
    const loggedInUser = user.findById(req.cookies.userId)

    const allFollowees = following.findAllFromUser(req.cookies.userId)
    res.render('start-following.html', {
        user: loggedInUser,
        following: allFollowees
    })
})

    //TODO: make sure you cannot follow multiple times, what happens when two or more users have the same name(?)
//handle start following form
routes.post('/start-following/new', (req, res) =>{
    const form = req.body
    console.log('start following', form)

    const id = user.selectUserByName(form.user).id

     //console.log("THIS USER HAS ID...", id)

    const newFollowing = following.insert(id, req.cookies.userId)


    res.redirect('/start-following')
})

// show the edit time form for a specific time
routes.get('/times/:id', (req, res) => {
    const timeId = req.params.id
    console.log('get time', timeId)

    // TODO: get the real time for this id from the db ->DONE(?)
    const jogs = jogging.findById(timeId)
    const loggedInUser = user.findById(req.cookies.userId)
    const jogTime = {
        id: timeId,
        startTime: jogs.date,
        duration: jogs.duration,
        distance: jogs.distance
    }

    res.render('edit-time.html', {
        time: jogTime,
        user: loggedInUser
    })
})

// handle the edit time form
routes.post('/times/:id', (req, res) => {
    const timeId = req.params.id
    const form = req.body

    console.log('edit time', {
        timeId: timeId,
        form: form
    })

    // TODO: edit the time in the db ->DONE(?)

    jogging.updateJogById(form.startTime, form.distance, form.duration, timeId)

    res.redirect('/times')
})

// handle deleteing the time
routes.get('/times/:id/delete', (req, res) => {
    const timeId = req.params.id
    console.log('delete time', timeId)

    // TODO: delete the time ->DONE(?)

    jogging.deleteTimeById(timeId)

    res.redirect('/times')
})

module.exports = routes
