'us strict'
var React = require('react')
var storeResults = require('../stores/results')
var CircleInfo   = require('./circle-info')

var Results = React.createClass({
    render: function () {
        var list = this.state.list
        return (
            <section>
                {
                    list.map(function (services, i) {
                        return (
                            <div key={i}>
                                {
                                    services.map(function (node, ii) {
                                        return (
                                            <div key={ii}>
                                                {
                                                    node.map(function (a, iii) {
                                                        return (
                                                            <CircleInfo key={iii} data={a} />
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
