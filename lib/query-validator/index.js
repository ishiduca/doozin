'use strict'
var through = require('through')

module.exports = function (validate) {
    return through(function (query) {
        try {
            validate(query)
        } catch (err) {
            return this.emit('error', err)
        }

        this.push(query)
    })
}
