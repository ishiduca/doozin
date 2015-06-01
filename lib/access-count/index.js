'use strict'
var path     = require('path')
var fs       = require('fs')
var through  = require('through2')
var printf   = require('printf')
var trumpet  = require('trumpet')
var express  = require('express')

var pack     = require('../../package')
var config   = pack.config.level.count
var dbPath   = path.join(__dirname, '../..', config.location)
var api      = require('record/api')(dbPath)
var template = path.join(__dirname, 'template.html')

var app = module.exports = express()

app.get('/', function (req, res, next) {
	var tr = trumpet()

	var format = [
		'<tr>'
	  , '<td class="category">%s</td>'
	  , '<td class="value">%s</td>'
	  , '<td class="count">%s</td>'
	  , '</tr>'
	].join('\n')

	res.setHeader('content-type', 'text/html')

    api.list().on('error', next)
	  .pipe(through.obj(function (pair, enc, done) {
		done(null, printf(format, pair.key.category, pair.key.value, pair.value))
	  }))
	  .pipe(tr.select('tbody').createWriteStream())

    tr.select('title').createWriteStream().end(printf('%s v%s - command.count', pack.name, pack.version))

	fs.createReadStream(template).on('error', next)
	  .pipe(tr)
	  .pipe(res)

}, function onError (err, req, res) {
	res.status(500).end(Error.prototype.toString.apply(err))
})
