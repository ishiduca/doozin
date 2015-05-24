var test      = require('tape')
var schema    = require('../services/commons/validator')
var through   = require('through')
var validator = require('query-validator')
var parse     = require('parse-line')

test('validator(schema)', function (t) {
    var spy = []
    var p = parse()

    p.pipe(validator(schema)).pipe(through(function (data) {
        spy.push(data)
    }))
    .on('end', function () {
        t.ok(1, 'validator emited "end"')
        t.is(spy.length, 2, 'spy.length === 2')
        t.deepEqual(spy[0], {category: 'mch', value: 'foo and bar'}
          , JSON.stringify(spy[0]))
        t.deepEqual(spy[1], {category: 'mak', value: 'peace maker'}
          , JSON.stringify(spy[1]))
        t.end()
    })

    p.write(' :mch foo and bar  ')
    p.end(' peace  maker ')
})

test('validator(schema).on("error", f)', function (t) {
    var p = parse()

    p.pipe(validator(schema)).on('error', function (err) {
        t.ok(err, 'validator emited "error"')
        t.ok(/"category" is required/.test(String(err)), String(err))
        t.end()
    })

    p.write(':nop beep')
})
