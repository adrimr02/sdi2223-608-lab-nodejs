const { MongoClient } = require('mongodb')
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const logger = require('morgan')
const crypto = require('crypto')
const expressSession = require('express-session')
let jwt = require('jsonwebtoken')
let rest = require('request');

const userSessionRouter = require('./routes/userSessionRouter')
const userAudiosRouter = require('./routes/userAudiosRouter')
const userAuthorRouter = require('./routes/userAuthorRouter')
const userTokenRouter = require('./routes/userTokenRouter')

const songsRepository = require('./repositories/songsRepository')
const usersRepository = require('./repositories/usersRepository')
const commentsRepository = require('./repositories/commentsRepository')

const indexRouter = require('./routes/index')

// Server setup
const app = express()
app.set('rest', rest);
app.set('uploadPath', __dirname)
app.set('clave', 'abcdefg')
app.set('crypto', crypto)
app.set('jwt', jwt)

// Database setup
const uri = "mongodb+srv://sdi2223-608:NQgbUZGRCYFx9Zlm@proyects.aukjk.mongodb.net/?retryWrites=true&w=majority"
app.set('connectionStrings', uri)
songsRepository.init(app, MongoClient)
usersRepository.init(app, MongoClient)
commentsRepository.init(app, MongoClient)

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

app.use("/songs/add",userSessionRouter)
app.use("/songs/edit",userSessionRouter)
app.use("/publications",userSessionRouter)
app.use("/shop/",userSessionRouter)
app.use("/songs/buy",userSessionRouter)
app.use("/purchases",userSessionRouter)
app.use("/comments/",userSessionRouter)
app.use("/audios/",userAudiosRouter)
app.use("/songs/edit",userAuthorRouter)
app.use("/songs/delete",userAuthorRouter)

app.use("/api/v1.0/songs/", userTokenRouter);

app.use(express.static(path.join(__dirname, 'public')))

/*
 * Setting routes
 */
app.use('/', indexRouter)
require('./routes/users')(app, usersRepository)
require('./routes/songs')(app, songsRepository, commentsRepository)
require('./routes/authors')(app)
require('./routes/comments')(app, commentsRepository, songsRepository)
require('./routes/api/songsAPIv1.0')(app, songsRepository, usersRepository)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err)
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
});

module.exports = app
