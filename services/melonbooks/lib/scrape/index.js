'use strict'
var trumpet  = require('trumpet')
var duplexer = require('duplexer2')
var through  = require('through2')
var merge    = require('deepmerge')
var homepage = require('../../configs/homepage')

module.exports = function () {
    var ended = false
    var tr    = trumpet()
    var rs    = through({objectMode: true})
    var dup   = duplexer(tr, rs)

    tr.once('error', onError)
      .once('end', function () {
          ended = true
      })

    tr.selectAll('div.product', function (product) {
        var pr = trumpet()
        var node = {}

        var title = pr.select('div.thumb>a')
		title.getAttribute('href', function (href) {
            mg({urlOfTitle: homepage.url + href})
        })
        title.getAttribute('title', function (title) {
            mg({title: title})
        })
        var circle = pr.select('div.title>p.circle>a')
		circle.getAttribute('href', function (href) {
            mg({urlOfCircle: homepage.url + href})
        })
		circle.getAttribute('title', function (title) {
            mg({circle: title})
        })
        pr.select('div.thumb>a>img').getAttribute('src', function (src) {
            mg({srcOfThumbnail: homepage.url + src.replace(/&amp;/g, '&')})
        })

        product.createReadStream().pipe(pr)

        function mg (_node) {
            node = merge(node, _node)
            if (Object.keys(node).length === 5) {
                rs.write(node)
                if (ended) process.nextTick(rs.end.bind(rs))
            }
        }
    })

    return dup

    function onError (err) { dup.emit('error', err) }
}
