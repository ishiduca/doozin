'use strict'
var express = require('express')
var params  = require('./params')
var app = module.exports = express()

app.set('views', __dirname)
app.set('view engine', 'hjs')

app.get('/', function (req, res) {
    res.render('dashboard', params)
})
