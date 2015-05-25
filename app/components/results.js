'use strict'
var React = require('react')
var storeResults = require('../stores/results')
var CircleInfo   = require('./circle-info')

var Results = React.createClass({
    render: function () {
        var list = this.state.list
        return (
            <section>
                {
                    list.map(function (commands, i) {
                        return (
                            <div key={i}>
                                <h3>{Object.keys(commands)[0]}</h3>
                                {
                                    commands[Object.keys(commands)[0]].map(function (services, ii) {
                                        return (
                                            <div key={ii}>
                                                <h4>{Object.keys(services)[0]}</h4>
                                                {
                                                    services[Object.keys(services)[0]].map(function (circleInfo, iii) {
                                                        return (
                                                            <CircleInfo key={iii} data={circleInfo} />
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </section>
        )
    }
  , getInitialState: function () {
        return {list: []}
    }
  , componentDidMount: function () {
        var me = this
        storeResults.on('data', function (list) {
            me.setState({list: list})
        })
    }
})

module.exports = Results
