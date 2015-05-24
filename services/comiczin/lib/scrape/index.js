'use strict'
var trumpet  = require('trumpet')
var duplexer = require('duplexer2')
var through  = require('through2')
var reduce   = require('stream-reduce')
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

    tr.selectAll('#form1>ul>li>div.list_item>div.data_area', function (product) {
        var node = {}
        var pr   = trumpet()

        pr.select('a').getAttribute('href', function (href) {
            mg({urlOfTitle: homepage.url + href})
        })
        var img = pr.select('a>img')
        img.getAttribute('src', function (src) {
            mg({srcOfThumbnail: homepage.url + src})
        })
        img.getAttribute('alt', function (alt) {
            mg({title: alt})
        })

        pr.select('p.item_comment_area').createReadStream()
        .pipe(reduce(function (innerHTML, str) {
            return innerHTML + str
        }, '')).once('data', function (_innerHTML) {
            var innerHTML = _innerHTML.replace(/\n/g, '')
            var pos = innerHTML.indexOf('<br')
            var circle = innerHTML.slice(0, pos)
            mg({circle: innerHTML.slice(0, pos).trim()})
        })

        product.createReadStream().pipe(pr)

        function mg (_node) {
            node = merge(node, _node)
            if (Object.keys(node).length === 4) {
                rs.write(node)
                //if (ended) process.nextTick(rs.end.bind(rs))
            }
        }
    })

    return dup

    function onError (err) {
        console.error(err)
        dup.emit('error', err)
    }
}
