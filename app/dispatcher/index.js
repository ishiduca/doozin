'use strict'
var through = require('through')

module.exports = through(function w (payload) {
	if (payload.actionType) return this.push(payload)

    var err  = new Error('"actionType" not found in payload')
    err.name = 'payloadTypeError'

    this.push({
        actionType: 'Error'
      , value: err
    })
}, function () {}, {autoDestroy: false})
