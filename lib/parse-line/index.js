'use strict'
var through = require('through2')
module.exports = function () {
    return through.obj(function w (_str, enc, done) {
        if ('buffer' === enc) _str = _str.toString('utf8')
        if (typeof _str !== 'string')
			return done(new TypeError('query must be "string"'))

       var str = _str.trim()
       str.slice(0, 1) !== ':' && (str = ':mak ' + str)
       var s = str.split(' ').filter(Boolean)
       var category = s.shift().slice(1)

        done(null, {
            category: category
          , value:    s.join(' ')
        })
    })
}
