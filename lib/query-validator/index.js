'use strict'
var through = require('through2')

module.exports = function (validate) {
    return through.obj(function (query, enc, done) {
        try {
            validate(query)
        } catch (err) {
			return done(err)
        }

		done(null, query)
    })
}
