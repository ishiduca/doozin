'use strict'
var React           = require('react')
var actToShoes      = require('../actions/to-shoes')
var storeShoesState = require('../stores/shoes-state')

var Form = React.createClass({
    render: function () {
        var placeholder = this.state.disabled
            ? 'wait to connect websocket...'
            : 'input command... ex:":help"'
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <input
                        type="text"
                        ref="command"
                        placeholder={placeholder}
                        required="required"
                        disabled={this.state.disabled}
                    />
                </div>
            </form>
        )
    }
  , handleSubmit: function (ev) {
        ev.preventDefault()
        var command = this.refs.command.getDOMNode()
        actToShoes.find(command.value)
        this.preset()
    }
  , getInitialState: function () {
        return {disabled: true}
    }
  , componentDidMount: function () {
        var me = this
        storeShoesState.on('data', function (isDisabled) {
            me.setState({disabled: isDisabled.disabled})
        })
        this.preset()
    }
  , preset: function () {
        var command = this.refs.command.getDOMNode()
        command.value = ''
        command.focus()
    }
})

module.exports = Form
