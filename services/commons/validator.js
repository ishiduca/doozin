'use strict'
var validatoo  = require('validatoo')
var categories = require('./categories')

module.exports = validatoo.schema({
    category: validatoo.validator(
        function (v) {
            return typeof v === 'string' &&
                   Object.keys(categories).indexOf(v) !== -1
        }
      , '"category" is required. key - "' + Object.keys(categories).join('", "') + '"'
    )
  , value: validatoo.validator(
        function (v) { return typeof v === 'string' && v.length > 0 }
      , '"value" is required'
    )
})
