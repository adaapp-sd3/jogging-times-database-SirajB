const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
var mustacheExpress = require('mustache-express')
const expressHandlebars = require('express-handlebars')
const routes = require('./routes')

// the port to listen on. choose whatever you want!
const port = process.env.PORT || 3000

// create a new express app:
const app = express()

// set up logging on our app:
app.use(morgan('dev'))

// turn JSON in requests to something we can work with:
app.use(bodyParser.json())

// let us set and retrieve cookies for user auth:
app.use(cookieParser())

// turn forms in requests to something we can work with:
app.use(bodyParser.urlencoded({ extended: true }))

// serve everything in the public directory:
app.use(express.static('public'))

// use the mustache for rendering views:
app.engine('html', expressHandlebars())
app.set('view engine', 'handlebars')

// create all the routes
app.use(routes)

// start the app!
app.listen(port, function() {
  console.log('Server listening on http://localhost:' + port)
})
