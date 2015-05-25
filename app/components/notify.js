'use strict'
var React = require('react')
var slows = require('slows')
var merge = require('deepmerge')
var store = require('../stores/notify')

var styles = {
    base: {
        padding:      '12px'
      , margin:       '6px 12px'
      , fontFamily:   'Arial'
      , borderRadius: '12px'
      , width:        '320px'
      , opacity:      '.80'
      , cursor:       'pointer'
    }
  , info: {
        backgroundColor: '#77dd77'
    }
  , error: {
        backgroundColor: '#ff7777'
    }
}

var ids = []

var displayMaxShows = 4
var displayInterval = 4200
var interval        = 800
var blocktime       = displayMaxShows * interval + displayInterval + 1000

var Notify = React.createClass({
    getInitialState: function () {
        return {msgs: []}
    }
  , componentDidMount: function () {
        var me = this
        store
            .pipe(slows(displayMaxShows, blocktime))
            .pipe(slows(interval))
            .on('data', function (msg) {
                var id = setInterval(function () {
                    var i = ids.indexOf(id)
                    if (i === -1) return
                    me.remove(i)
                }, displayInterval)

                ids.push(id)

                if (msg.length > 200) msg = msg.slice(0, 200) + '...'

                me.setState({msgs: me.state.msgs.concat([msg])})
            })
    }
  , remove: function (i) {
        var msgs = this.state.msgs.slice()

        clearInterval(ids[i])

        msgs.splice(i, 1)
        ids.splice(i, 1)

        this.setState({msgs: msgs})
    }
  , handlePopupClick: function (n) {
        this.remove(n)
    }
  , render: function () {
        var me = this
        if (this.state.msgs.length === 0) {
            return (
                <div id="notify" style={{display: 'none'}} />
            )
        }

        return (
            <div
                id="notify"
                style={{
                    position: 'fixed'
                  , top:      '12px'
                  , right:    '0'
                  , zIndex:   '4'
                }}
            >
                {
                    this.state.msgs.map(function (msg, i) {
                        return (
                            <Popup
                                key={i}
                                pos={i}
                                msg={msg}
                                onPopupClick={me.handlePopupClick}
                            />
                        )
                    })
                }
            </div>
        )
    }
})

var Popup = React.createClass({
    render: function () {
        return (
            <div
                style={
                    /error/i.test(this.props.msg)
                        ? (merge(styles.base, styles.error))
                        : (merge(styles.base, styles.info))
                }
                onClick={this.handleClick}
            >
                {this.props.msg}
            </div>
        )
    }
  , handleClick: function (ev) {
        ev.preventDefault()
        this.props.onPopupClick(this.props.pos)
    }
})


module.exports = Notify
