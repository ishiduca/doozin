'use strict'
var path      = require('path')
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
var record    = require('record')
var pack      = require('../../package')

var dbPath    = path.join(__dirname, '../../dbs/count')

var CP932 = 'cp932'

module.exports = shoe(function (shoes) {
    var rs = through.obj(function (data, enc, done) {
        console.log(data)
        done(null, data)
    })

    shoes
        .pipe(duplexer(through.obj(function (str, enc, done) {
            var p = parse().once('error', onError)
            var r = record(dbPath).on('incr', console.warn.bind(console))

            p.pipe(validator(schema)).once('error', onError)
			 .pipe(r)

            r.pipe(transform(transTo, {charset: CP932}))
             .pipe(request(reqOptTo.url, reqOptTo.option)).once('error', onError)
             .pipe(iconv.decodeStream(CP932))
             .pipe(scrapeTo())
             .pipe(m(str, 'toranoana'))
             .pipe(rs, {end: false})

            r.pipe(transform(transMe))
             .pipe(request(reqOptMe.url, reqOptMe.option)).once('error', onError)
             .pipe(scrapeMe())
             .pipe(m(str, 'melonbooks'))
             .pipe(rs, {end: false})

            r.pipe(transform(transZn))
             .pipe(request(reqOptZn.url, reqOptZn.option)).once('error', onError)
             .pipe(scrapeZn())
             .pipe(m(str, 'comiczin'))
             .pipe(rs, {end: false})

            p.end(str)
            done()
        }), rs))
        .pipe(es.stringify())
        .pipe(shoes)

    rs.setMaxListeners(0)
    shoes.setMaxListeners(0)

    function onError (err) {
        console.error(err)
        shoes.write(JSON.stringify({
            error: true
          , actionType: err.name || 'Error'
          , value: err.message   || String(err)
        }))
    }

    function m (str, service) {
        return through.obj(function (data, enc, done) {
            done(null, {
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
