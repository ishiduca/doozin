'use strict'
var through = require('through2')
var getApi  = require('./api')

module.exports = function (dbPath) {
    var api = getApi(dbPath)

    return through.obj(function (query, enc, done) {
        var me = this
        api.incr(query, function (err, keyAndCount) {
            if (keyAndCount) me.emit('incr', keyAndCount)
            err ? done(err) : done(null, query)
        })
    })
}
