const { MongoClient } = require('mongodb')
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const logger = require('morgan')
const crypto = require('crypto')
const expressSession = require('express-session')

const songsRepository = require('./repositories/songsRepository.js')
const usersRepository = require('./repositories/usersRepository')
const indexRouter = require('./routes/index')

// Server setup
const app = express()
app.set('uploadPath', __dirname)
app.set('clave', 'abcdefg')
app.set('crypto', crypto)

// Database setup
const uri = "mongodb+srv://sdi2223-608:NQgbUZGRCYFx9Zlm@proyects.aukjk.mongodb.net/?retryWrites=true&w=majority"
app.set('connectionStrings', uri)
songsRepository.init(app, MongoClient)
usersRepository.init(app, MongoClient)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'twig')

// Middlewares setup
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(fileUpload({
  limits: { filesize: 50 * 1024 * 1024 },
  createParentPath: true
}))
app.use(expressSession({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true
}))
app.use(express.static(path.join(__dirname, 'public')))

/*
 * Setting routes
 */
app.use('/', indexRouter)
require('./routes/users')(app, usersRepository)
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
