const { MongoClient } = require('mongodb')
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')

const logger = require('morgan')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

const app = express()

// Database setup
const uri = "mongodb+srv://sdi2223-608:NQgbUZGRCYFx9Zlm@proyects.aukjk.mongodb.net/?retryWrites=true&w=majority"
app.set('connectionStrings', uri)
const songsRepository = require("./repositories/songsRepository.js")
songsRepository.init(app, MongoClient)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'twig')

// Middlewares setup
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

/*
 * Setting routes
 */
app.use('/', indexRouter)
app.use('/users', usersRouter)
require('./routes/songs')(app, songsRepository)
require('./routes/authors')(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
});

module.exports = app
