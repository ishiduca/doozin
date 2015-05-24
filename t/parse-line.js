var test  = require('tape')
var parse = require('parse-line')
var through = require('through')

test('parse().pipe(stream)', function (t) {
    var spy = []
    var act = parse()

    act.pipe(through(function (query) {
        spy.push(query)
    })).on('end', function () {
        t.is(spy.length, 3, JSON.stringify(spy))
        t.deepEqual(spy[0], {category: 'mak', value: 'O.Riginal brand'}, JSON.stringify(spy[0]))
        t.deepEqual(spy[1], {category: 'mak', value: '関西オレンジ'}, JSON.stringify(spy[1]))
        t.deepEqual(spy[2], {category: 'help', value: ''}, JSON.stringify(spy[2]))
        t.end()
    })

    act.write(':mak  O.Riginal brand ')
    act.write(' 関西オレンジ')
    act.end(':help')
})

//test('error', function (t) {
//    var spy = []
//    var act = parse()
//
//    var errs = through(function (err) {
//        t.ok(/can not use such a category ":ero"/.test(err.message)
//          , String(err))
//    }).on('end', function () {
//        t.end()
//    })
//
//    act.on('error', errs.end.bind(errs))
//    .on('end', function () {
//        console.log('[end]')
//    })
//
//    act.write('peace maker')
//    act.write(':ero hammer_head')
//    act.end(':gnr かんこれ')
//})
