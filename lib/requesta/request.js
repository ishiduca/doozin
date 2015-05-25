'use strict'
var hyperquest = require('hyperquest')
var merge      = require('deepmerge')
var duplexer   = require('duplexer2')
var through    = require('through2')

module.exports = function (requestUrl, _opt) {
    var opt = merge({}, _opt || {})
    var rs = through.obj()
    var ws = through.obj(function (query, enc, done) {
        var isPost = (opt.method || '').toLowerCase() === 'post'
        var url = isPost ? requestUrl : requestUrl + '?' + query
        var req = hyperquest(url, opt)

        req.on('error', onError).pipe(rs)

        if (isPost) {
            req.setHeader('content-type', 'application/x-www-form-urlencoded')
            req.setHeader('content-length', Buffer.byteLength(query))
        }

        isPost && req.end(query)

        done()
    })
    var dup = duplexer(ws, rs)

    return dup

    function onError (err) {
        dup.emit('error', err)
    }
}
