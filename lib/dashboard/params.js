'use strict'
var printf = require('printf')
var pack   = require('../../package')

module.exports = {
    title: printf('%s v%s', pack.name, pack.version)
  , styles: [
        {href: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css'}
      , {href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.min.css'}
      , {href: '/css/dashboard.css'}
    ]
  , bundle_js: {
        src: '/js/bundle.js'
    }
}
