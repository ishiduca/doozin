'use strict'
var trumpet  = require('trumpet')
var duplexer = require('duplexer')
var through  = require('through')
var reduce   = require('stream-reduce')
var merge    = require('deepmerge')
var homepage = require('../../configs/homepage')

module.exports = function scrape () {
    var ended = false
    var tr  = trumpet()
    var rs  = through()
    var dup = duplexer(tr, rs)

    tr.once('end', function () { ended = true })
      .once('error', onError)

    rs.setMaxListeners(0)

    tr.selectAll('td.Main>table.whole_w_left>tr>td>table>tr>td>div>center', function (product) {
        var t    = trumpet()
        var node = {}

        t.select('a').getAttribute('href', function (href) {
            mg({urlOfTitle: homepage.url + href})
        })
        var img = t.select('a>img')
        img.getAttribute('src', function (src) {
            mg({srcOfThumbnail: src})
        })
        img.getAttribute('title', function (title) {
            mg({title: title})
        })

        t.select('table').createReadStream()
          .pipe(reduce(function (innerTable, str) {
            return innerTable + str
          }, ''))
          .once('data', function (_innerTable) {
            var innerTable = String(_innerTable).replace(/\n/g, '').replace(/\t/g, '')
            var reg = /href=" ([^"]+?)">(.+?)<\/a/
            var res = innerTable.match(reg)
            if (res) {
                mg({
                    urlOfCircle: homepage.url + res[1]
                  , circle: res[2].replace(/<img[^>]+?>/, '')
                })
            } else {
                rs.write(node)
            }
          })


        product.createReadStream().pipe(t)

        function mg (_node) {
            node = merge(node, _node)
            if (Object.keys(node).length === 5) {
                rs.write(node)
                //if (ended) process.nextTick(rs.end.bind(rs))
            }
        }
    })

    return dup

    function onError (err) { dup.emit('error', err) }
}
