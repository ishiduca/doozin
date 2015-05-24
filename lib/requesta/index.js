'use strict'
var hyperquest = require('hyperquest')
var merge      = require('deepmerge')
var duplexer   = require('duplexer')
var through    = require('through')

module.exports = function (requestUrl, _opt) {
    var opt = merge({}, _opt || {})
    var rs = through()
    var ws = through(function (query) {
        var isPost = (opt.method || '').toLowerCase() === 'post'
        var url = isPost ? requestUrl : requestUrl + '?' + query
        var req = hyperquest(url, opt)

        req.on('error', onError).pipe(rs)

        if (isPost) {
            req.setHeader('content-type', 'application/x-www-form-urlencoded')
            req.setHeader('content-length', Buffer.byteLength(query))
        }

        isPost && req.end(query)
    })
    var dup = duplexer(ws, rs)

    return dup

    function onError (err) {
        console.error(err)
//        dup.emit('error', err)
    }
}
