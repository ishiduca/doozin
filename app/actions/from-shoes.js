'use strict'
var through = require('through')
var assign  = require('object-assign')

module.exports = assign(through(), {
	connected: function () { this.write({actionType: 'shoes.connected'}) }
  , closed:    function () { this.write({actionType: 'shoes.closed', value: 'error: socket unconnected'}) }
})
