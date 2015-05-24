'use strict'
var urlencode = require('urlencode')
var through   = require('through2')

module.exports = function (transf, option) {
    return through.obj(function (query, enc, done) {
        done(null, urlencode.stringify(transf(query), option))
    })
}
