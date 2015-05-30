'use strict'
var shoe      = require('shoe')
var es        = require('event-stream')
var iconv     = require('iconv-lite')
var through   = require('through2')
var duplexer  = require('duplexer2')
var merge     = require('deepmerge')
var parse     = require('parse-line')
var validator = require('query-validator')
var schema    = require('../../services/commons/validator')
var transform = require('query-transform')
var transMe   = require('../../services/melonbooks/lib/transform')
var transTo   = require('../../services/toranoana/lib/transform')
var transZn   = require('../../services/comiczin/lib/transform')
var request   = require('requesta')
var reqOptMe  = require('../../services/melonbooks/configs/request')
var reqOptTo  = require('../../services/toranoana/configs/request')
var reqOptZn  = require('../../services/comiczin/configs/request')
var scrapeMe  = require('../../services/melonbooks/lib/scrape')
var scrapeTo  = require('../../services/toranoana/lib/scrape')
var scrapeZn  = require('../../services/comiczin/lib/scrape')

var CP932 = 'cp932'

module.exports = shoe(function (shoes) {
    var errs = errors()
    var v    = validator(schema).on('error', onError).on('unpipe', onUnpipe)
    var f    = format()
    var s    = es.stringify()

    shoes
     .pipe(parse()).on('error', onError).on('unpipe', onUnpipe)
     .pipe(v)

    v.pipe(transform(transTo, {charset: CP932}))
     .pipe(request(reqOptTo.url, reqOptTo.option)).on('error', onError).on('unpipe', onUnpipe)
     .pipe(iconv.decodeStream(CP932))
     .pipe(scrapeTo())
     .pipe(f, {end: false})

    v.pipe(transform(transMe))
     .pipe(request(reqOptMe.url, reqOptMe.option)).on('error', onError).on('unpipe', onUnpipe)
     .pipe(scrapeMe())
     .pipe(f, {end: false})

    v.pipe(transform(transZn))
     .pipe(request(reqOptZn.url, reqOptZn.option)).on('error', onError).on('unpipe', onUnpipe)
     .pipe(scrapeZn())
     .pipe(f, {end: false})

    f.pipe(s)
    errs.pipe(s)

    s.pipe(shoes)

    shoes.setMaxListeners(0)

    function onError (err) {
        errs.write(err)
    }
})

function format () {
    return through.obj(function (node, enc, done) {
        done(null, {
            actionType: 'find.result'
          , value: node
        })
    })
}

function errors () {
    return through.obj(function (err, enc, done) {
        console.error(err)
        done(null {
            actionType: err.name || 'Error'
          , value: Error.prototype.toString.apply(err)
        })
    })
}

function onUnpipe (src) {
    src.pipe(this)
}
