'use strict'
var through = require('through')

module.exports = through(function (payload) {
    if (payload.actionType === 'shoes.connected') {
        this.push({disabled: false})
    }
    if (payload.actionType === 'shoes.closed') {
        this.push({disabled: true})
    }
})
