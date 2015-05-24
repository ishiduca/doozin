var test       = require('tape')
var through    = require('through')
var schema     = require('../services/commons/validator')
var transform  = require('query-transform')
var parse      = require('parse-line')
var validator  = require('query-validator')
var melonbooks = require('../services/melonbooks/lib/transform')
var toranoana  = require('../services/toranoana/lib/transform')

test(
  'validator(schema).pipe(transform(trans_func, {charset: encoding}))' +
  ' # melonbooks'
, function (t) {
    var p = parse()

    p.pipe(validator(schema)).pipe(transform(melonbooks))
     .pipe(through(function (data) {
        t.ok(/name=%E9%96%A2%E8%A5%BF%E3%82%AA%E3%83%AC%E3%83%B3%E3%82%B8(?:&.+)?$/.test(data), data)
    }))
    .on('end', function () {
        t.ok(1, 'transform emited "end"')
        t.end()
    })

    p.end('関西オレンジ')
})

test(
  'validator(schema).pipe(transform(trans_func, {charset: encoding}))' +
  ' # toranoana'
, function (t) {
    var p = parse()

    p.pipe(validator(schema)).pipe(transform(toranoana, {charset: 'cp932'}))
     .pipe(through(function (data) {
         t.ok(/mak=%8A%D6%90%BC%83%49%83%8C%83%93%83%57(?:&.+)?$/.test(data),data)
    }))
    .on('end', function () {
        t.ok(1, 'transform emited "end"')
        t.end()
    })

    p.end('関西オレンジ')
})
