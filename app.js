'use strict'
var path    = require('path')
var express = require('express')
var pack    = require('./package')
var config  = pack.config
var app     = express()
var port    = process.env.PORT || config.server.port
var root    = path.join(__dirname, config.static.root)

app.use(express.static(root))
app.use(require('dashboard'))
require('shoes').install(app.listen(port), config.shoes.url)

console.log('[process.pid - %s]', process.pid)
console.log('[server start to listen on port %s]', port)
