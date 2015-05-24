'use strict'
var React   = require('react')
var Form    = require('./form')
var Notify  = require('./notify')
var Results = require('./results')

var App = React.createClass({
    render: function () {
        return (
            <section id="react-app">
                <Form />
                <Notify />
                <Results />
             </section>
        )
    }
})

module.exports = App
//        <section id="react-app">
//            <Form />
//            <Notify />
//            <Results />
//            <Favorites />
//        </section>
