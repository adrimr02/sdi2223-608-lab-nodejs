#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('../app')
const debug = require('debug')('musicstoreapp:server')
const http = require('http')
const https = require('https')
const { readFileSync } = require('fs')
const { join } = require('path')
/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '8081')
app.set('port', port)

/**
 * Load HTTPS certificates
 */
const privateKey = readFileSync(join(__dirname,'certificates/alice.key'), 'utf8')
const certificate = readFileSync(join(__dirname,'certificates/alice.crt'), 'utf8')
const credentials = {key: privateKey, cert: certificate}


/**
 * Create HTTP and HTTPS server.
 */
var server = http.createServer(app)
var httpsServer = https.createServer(credentials , app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
httpsServer.listen(4000)
server.on('error', onError)
server.on('listening', onListening)
httpsServer.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}
