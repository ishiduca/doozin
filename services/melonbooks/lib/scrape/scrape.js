'use strict'
var trumpet  = require('trumpet')
var duplexer = require('duplexer')
var through  = require('through')
var homepage = require('../../configs/homepage')

module.exports = function scrape () {
    var ended = false
    var tr  = trumpet()
    var rs  = through(function (data) {this.queue(data)})
    var dup = duplexer(tr, rs)

    tr.once('error', onError).once('end', function () { ended = true })

    tr.selectAll('div.product', function (ele) {
        var t   = trumpet()
        var res = {}
        var c   = 0

        var title  = t.select('div.thumb>a')
        var circle = t.select('div.title>p.circle>a')

        t.select('div.thumb>a>img').getAttribute('src', function (src) {
            res.srcOfThumbnail = homepage.url + src.replace(/&amp;/g, '&')
            done()
        })

        title.getAttribute('href', function (href) {
            res.urlOfTitle = homepage.url + href
            done()
        })

        title.getAttribute('title', function (title) {
            res.title = title
            done()
        })

        circle.getAttribute('href',  function (href) {
            res.urlOfCircle = homepage.url + href
            done()
        })

        circle.getAttribute('title',  function (title) {
            res.circle = title
            done()
        })

        ele.createReadStream().on('error', onError)
            .pipe(t).on('error', onError)

        function done () {
            if ((c += 1) === 5) {
                rs.write(res)
                ;(ended) && process.nextTick(rs.end.bind(rs))
            }
        }
    })

    return dup

    function onError (err) { dup.emit('error', err) }
}
