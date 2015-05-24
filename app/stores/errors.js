'use strict'
var through = require('through')

module.exports = through(function (payload) {
	if (/error/i.test(payload.actionType)) {
		console.error(payload.value)
	}
})
