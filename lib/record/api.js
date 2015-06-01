'use strict'
var level = require('level')
var pack  = require('../../package')
var config = pack.config.level.count
var db

module.exports = function (dbPath) {
    db || (db = level(dbPath, config.options))

    return {
        incr: incr
      , list: list
      , _db: db
    }

    function incr (query, done) {
        db.get(query, function (err, count) {
            if (count) return put(Number(count))
            if (err && err.type === 'NotFoundError') return put(0)
            done(err)
        })

        function put (_count) {
            var count = _count + 1
            db.put(query, count, function (err) {
                err ? done(err) : done(null, {key: query, count: count})
            })
        }
    }

    function list (options) {
        return db.creteReadStream(options)
    }
}
