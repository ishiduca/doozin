var test      = require('tape')
var through   = require('through2')
var record    = require('record/api')
var parse     = require('parse-line')
var validator = require('query-validator')
var schema    = require('../services/commons/validator')
var records   = require('record')

var dbPath = __dirname + '/count'

function teardown () {
    var api = record(dbPath)
    var db  = api._db
    db.createKeyStream().on('data', function (key) {
        db.del(key, function (err) {
            console.warn(err || '[record._db.del %s]', JSON.stringify(key))
        })
    })
}

test('var api = require("record/api")(dbPath)', function (t) {
    var api = record(dbPath)
    t.is(typeof api.incr, 'function', 'typeof api.incr === "function"')
    t.end()
})

test('api.incr(query, callback)', function (t) {
    var api = record(dbPath)
    var query = {category: 'mak', value: 'ひとのふんどし'}
    api.incr(query, function (err, keyAndCount) {
        t.ok(true, 'api.incr called callback')
        t.ok(keyAndCount, JSON.stringify(keyAndCount))
        t.deepEqual(keyAndCount.key, query, 'keyAndCount.key deepEqual query')
        t.is(keyAndCount.count, 1, 'keyAndCount is 1')
        t.end()

    })
})

test('parse().pipe(validator(schema)).pipe(records(dbPath)).pipe(nextStream)', function (t) {
    var spy  = []
    var spyy = []
    var p    = parse()

    var q = {category: 'mak', value: 'ひとのふんどし'}

    p.pipe(validator(schema))
     .pipe(records(dbPath)).on('incr', function (keyAndCount) {
        spyy.push(keyAndCount)
     })
     .pipe(through.obj(function (query, enc, done) {
        spy.push(query)
        done(null, query)
     }))
     .once('finish', function () {
        t.ok(true, 'stream emit("finish")')
        t.is(spy.length,  1, 'spy.length === 1')
        t.is(spyy.length, 1, 'spyy.length === 1')
        t.deepEqual(spy[0], q, JSON.stringify(spy[0]))
        t.deepEqual(spyy[0], {key: q, count: 2}, JSON.stringify(spyy[0]))
        t.end()
        teardown()
     })

    p.end('ひとのふんどし')
})
