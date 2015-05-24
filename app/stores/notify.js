'use strict'
var through = require('through')
var printf  = require('printf')

module.exports = through(function (payload) {
    this.push(printf('%s: %O', payload.actionType, payload.value))
})
