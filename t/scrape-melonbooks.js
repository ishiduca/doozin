var test = require('tape')
var fs   = require('fs')
var path = require('path')
var through = require('through')
var scrape = require('../services/melonbooks/lib/scrape')

var ts = ('僕のカノジョ|clover*3|むっちゃんとちっちゃい提督|Happy Life 2|NEGATIVE LOVE M2|HaPPY LIFe').split('|')
var cs = ts.map(function () { return '関西オレンジ' })
var ucs = cs.map(function () { return 'https://www.melonbooks.co.jp/circle/index.php?circle_id=17939' })
var uts = [
  'https://www.melonbooks.co.jp/detail/detail.php?product_id=125655'
, 'https://www.melonbooks.co.jp/detail/detail.php?product_id=114703'
, 'https://www.melonbooks.co.jp/detail/detail.php?product_id=29669'
, 'https://www.melonbooks.co.jp/detail/detail.php?product_id=28652'
, 'https://www.melonbooks.co.jp/detail/detail.php?product_id=24586'
, 'https://www.melonbooks.co.jp/detail/detail.php?product_id=17885'
]
var srcss = [
  'https://www.melonbooks.co.jp/resize_image.php?image=212001084136.jpg&width=151&height=151&c=1&aa=0'
, 'https://www.melonbooks.co.jp/resize_image.php?image=212001080487.jpg&width=151&height=151&c=1&aa=0'
, 'https://www.melonbooks.co.jp/resize_image.php?image=212001076187.jpg&width=151&height=151&c=1&aa=0'
, 'https://www.melonbooks.co.jp/resize_image.php?image=212001075143.jpg&width=151&height=151&c=1&aa=0'
, 'https://www.melonbooks.co.jp/resize_image.php?image=212001072051.jpg&width=151&height=151&c=1&aa=0'
, 'https://www.melonbooks.co.jp/resize_image.php?image=212001064382.jpg&width=151&height=151&c=1&aa=0'
]

test('req().pipe(scrape()).pipe(stream)', function (t) {
    var circles = []
    var titles  = []
    var urlcs   = []
    var urlts   = []
    var srcs    = []

    fs.createReadStream(path.join(__dirname, 'melonbooks.result.html'))
      .pipe(scrape())
      .pipe(through(function (node) {
        titles.push( node.title)
        circles.push(node.circle)
        urlcs.push(  node.urlOfCircle)
        urlts.push(  node.urlOfTitle)
        srcs.push(   node.srcOfThumbnail)
      }))
      .on('end', function () {
          t.is(circles.length, 6, 'circles.lnegth === 6')
        t.deepEqual(titles,  ts,  titles.join(', '))
        t.deepEqual(circles, cs,  circles.join(', '))
        t.deepEqual(urlcs,  ucs,  urlcs[0])
        t.deepEqual(urlts,  uts,  urlts[0])
        t.deepEqual(srcs,   srcss, srcs[0])
        t.ok(1, 'scrape emited "end"')
        t.end()
      })
})
