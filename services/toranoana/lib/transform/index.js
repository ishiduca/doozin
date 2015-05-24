'use strict'
var merge  = require('deepmerge')

module.exports = function (_q) {
    var q = {}
    q[_q.category] = _q.value

    return merge({
        item_kind: '0401'
      , bl_flg:    0
      , adl:       0
      , obj:       0
      , stk:       1
      , img:       1
      , ps:        1
    }, q)
}
