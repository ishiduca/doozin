'use strict'
var through = require('through')
// table = {
//     _command: {
//         _service: {
//             id: {circleInfo}
//           , id: ...
//         }
//     }
// }
var table       = {}
// commandlist = [ _command, _command, ...] 
var commandlist = []
// list = [
//     {
//         _command: [
//             {
//                 _service: [
//                     {cirleInfo}
//                 ]
//             }
//         ]
//     }
// ]
module.exports = through(function (payload) {
    if (payload.actionType === 'find.result') {
        var value    = payload.value
        var _command = value.meta.command
        var _service = value.meta.service
        var node     = value.content
        var id       = node.urlOfTitle

        commandlist.indexOf(_command) === -1 && commandlist.unshift(_command)

        var commands = table[_command] || (table[_command] = {})
        var services = commands[_service] || (commands[_service] = {})

        services[id] = node

        this.push(
            commandlist.map(function (_command) {
                var w = {}
                w[_command] = Object.keys(table[_command]).map(function (_service) {
                    var w = {}
                    w[_service] = Object.keys(table[_command][_service]).map(function (id) {
                        return table[_command][_service][id]
                    })
                    return w
                })
                return w
            })
        )
    }
})
