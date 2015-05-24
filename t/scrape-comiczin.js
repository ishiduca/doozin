var test    = require('tape')
var path    = require('path')
var fs      = require('fs')
var scrape  = require('../services/comiczin/lib/scrape')
var through = require('through')

var ts = ['僕のカノジョ', 'Paranoia']
var cs = ts.map(function () { return '関西オレンジ' })
var uts = [
  'http://shop.comiczin.jp/products/detail.php?product_id=24149'
, 'http://shop.comiczin.jp/products/detail.php?product_id=13561'
]
var srcss = [
  'http://shop.comiczin.jp/upload/save_image/_24000/_m/24149_s.jpg'
, 'http://shop.comiczin.jp/upload/save_image/_13000/_m/13561_s.jpg'
]


test('req().pipe(scrape()).pipe(stream)', function (t) {
    var circles = []
    var titles  = []
    //var urlcs
    var urlts   = []
    var srcs    = []

	var mock = through(function (node) {
        circles.push(node.circle)
        titles.push( node.title)
        urlts.push(  node.urlOfTitle)
        srcs.push(   node.srcOfThumbnail)
    })

    fs.createReadStream(path.join(__dirname, 'comiczin.result.html'))
    .pipe(scrape())
    .pipe(mock)
    .on('end', function () {
        t.deepEqual(ts, titles, ts.join(', '))
		t.deepEqual(cs, circles, cs.join(', '))
		t.deepEqual(uts, urlts,  uts[0])
		t.deepEqual(srcs, srcss, srcs[0])
        t.end()
    })

    setTimeout(mock.end.bind(mock), 1000)
})
