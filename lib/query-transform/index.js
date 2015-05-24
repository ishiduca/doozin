'use strict'
var urlencode = require('urlencode')
var through   = require('through')

module.exports = function (transf, option) {
    return through(function (query) {
        this.push(urlencode.stringify(transf(query), option))
    })
}
