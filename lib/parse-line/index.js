'use strict'
var through = require('through')
module.exports = function () {
    return through(function w (_str) {
        if (typeof _str !== 'string')
            return this.emit('error', new TypeError('query must be "string"'))

        var str = _str.trim()
        str.slice(0, 1) !== ':' && (str = ':mak ' + str)
        var s = str.split(' ').filter(Boolean)
        var category = s.shift().slice(1)

        this.push({
            category: category
          , value:    s.join(' ')
        })
    })
}
