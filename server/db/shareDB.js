var ReconnectingWebSocket = require('reconnecting-websocket');
var richText = require('rich-text');
var sharedb = require('sharedb/lib/client');
const WS = require('ws');

sharedb.types.register(richText.type);

socketIP = process.env.SOCKETIP
// ShareDB Connection
var socket = new ReconnectingWebSocket('ws://' + socketIP + ':4001', [], { WebSocket: WS });
console.log("Connected to shareDB on " + 'ws://' + socketIP + ':4001')
var connection = new sharedb.Connection(socket);

module.exports = connection