'use strict'
var through = require('through')
var assign  = require('object-assign')

module.exports = assign(
    through(function (str) {
        this.push(str)
    })
  , {
        find: function (str) {
            this.write(str)
        }
    }
)
