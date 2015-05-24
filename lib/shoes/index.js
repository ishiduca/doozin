'use strict'
var shoe      = require('shoe')
var es        = require('event-stream')
var iconv     = require('iconv-lite')
var through   = require('through')
var duplexer  = require('duplexer')
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
    var errs = through(function (err) {
        this.push(String(err))
        console.error(err)
    })

    errs.pipe(shoes)

    var rs = through(function (data) {
        this.push(data)
        console.log(data)
    }, {autoDelay: false})

    shoes
    .pipe(duplexer(through(function (str) {
        var p = parse().once('error', onError)
        var v = validator(schema).once('error', onError)

        p.pipe(v)

        v.pipe(transform(transTo, {charset: CP932}))
         .pipe(request(reqOptTo.url, reqOptTo.option)).once('error', onError)
         .pipe(iconv.decodeStream(CP932))
         .pipe(scrapeTo())
         .pipe(m(str, 'toranoana'))
         .pipe(rs, {end: false})

        v.pipe(transform(transMe))
         .pipe(request(reqOptMe.url, reqOptMe.option)).once('error', onError)
         .pipe(scrapeMe())
         .pipe(m(str, 'melonbooks'))
         .pipe(rs, {end: false})

        v.pipe(transform(transZn))
         .pipe(request(reqOptZn.url, reqOptZn.option)).once('error', onError)
         .pipe(scrapeZn())
         .pipe(m(str, 'comiczin'))
         .pipe(rs, {end: false})

        p.end(str)
    }), rs))
    .pipe(es.stringify())
    .pipe(shoes)


    function onError (err) {
        errs.write(err)
    }

    function m (str, service) {
        return through(function (data) {
            this.push({
                actionType: 'find.result'
              , value: {
                    meta: {
                        service: service
                      , command: str
                    }
                  , content: data
                }
            })
        })
    }
})
