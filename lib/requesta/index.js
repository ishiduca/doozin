'use strict'
var hyperquest = require('hyperquest')
var merge      = require('deepmerge')
var duplexer   = require('duplexer2')
var through    = require('through2')
var printf     = require('printf')

module.exports = function (requestUrl, _opt) {
    var opt = merge({}, _opt || {})
    var rs = through.obj()
    var ws = through.obj(function (query, enc, done) {
        var isPost = (opt.method || '').toLowerCase() === 'post'
        var url = isPost ? requestUrl : requestUrl + '?' + query

        var interval = 1000
        var max      = 5
        var start    = 0

        fetch()
        done()

        function fetch () {
            var req = hyperquest(url, opt)

            req.once('response', function (res) {
                var statusCode = res.statusCode
                if (! /^2/.test(statusCode)) {
                    req.unpipe(rs)
                    console.log(res.headers)
                    if ((start += 1) < max) {
                        var id = setTimeout(function () {
                            clearTimeout(id)
                            id = null
                            fetch()
                        }, interval)
                    } else {
                        var format = 'http.responseStatusCodeError: [%s] %s'
                        var err = new Error(printf(format, statusCode, url))
                        onError(err)
                    }
                }
            })
            .once('error', onError)
            .once('end', function onEnd () {
                console.warn(printf('[hyperquest.request.end - %s]', url))
                this.unpipe(rs)
            })
            .pipe(rs, {end: false})

            if (isPost) {
                req.setHeader('content-type', 'application/x-www-form-urlencoded')
                req.setHeader('content-length', Buffer.byteLength(query))
            }

            isPost && req.end(query)
        }
    })
    var dup = duplexer(ws, rs)

    return dup

    function onError (err) {
        dup.emit('error', err)
    }
}
