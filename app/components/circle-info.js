'use strict'
var React = require('react')

var Item = React.createClass({
    render: function () {
        var data = this.props.data
        return (
            <div>
                <a
                    href={data.urlOfTitle}
                    target="_blank"
                >
                    <img src={data.srcOfThumbnail} />
                </a>
                <a
                    href={data.urlOfTitle}
                    target="_blank"
                >
                    {data.title}
                </a>
                <span>/</span>
                {
                    data.urlOfCircle
                        ? (
                            <a
                                href={data.urlOfCircle}
                                target="_blank"
                            >
                                  {data.circle}
                            </a>
                          )
                        : (
                              <span>{data.circle}</span>
                          )
                }
            </div>
        )
    }
})

module.exports = Item
