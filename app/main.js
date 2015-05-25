'use strict'
var es              = require('event-stream')
var bind            = require('component-bind')
var shoe            = require('shoe')
var actToShoes      = require('./actions/to-shoes')
var actFromShoes    = require('./actions/from-shoes')
var storeErrors     = require('./stores/errors')
var storeNotify     = require('./stores/notify')
var storeShoesState = require('./stores/shoes-state')
var storeResults    = require('./stores/results')
var dispatcher      = require('./dispatcher')

dispatcher.setMaxListeners(0)

var shoeUrl = '/shoes'

window.onload = function () {
    var shoes = shoe(shoeUrl)

    shoes.on('connect', bind(actFromShoes, actFromShoes.connected))
    shoes.on('end',     bind(actFromShoes, actFromShoes.closed))

// app -> shoes
    actToShoes.pipe(shoes)
// shoes -> app
    shoes.pipe(es.parse(), {end: false}).pipe(dispatcher)

    actFromShoes.pipe(dispatcher)

    ;[  storeErrors
      , storeShoesState
      , storeResults
      , storeNotify
    ].forEach(function (store) {
        dispatcher.pipe(store)
    })
}

var React = require('react')
var App   = require('./components/app')

React.render(<App />, document.querySelector('main'))
