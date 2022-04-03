var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var richText = require('rich-text');
var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');

ShareDB.types.register(richText.type);
var ShareDBServer = new ShareDB();
createDoc(startServer);

function startServer() {
    var app = express();
    app.use(express.static('static'));
    app.use(express.static('node_modules/quill/dist'));
    
    var server = http.createServer(app);

    var wss = new WebSocket.Server({ server }).on('connection', ws => {
        const stream = new WebSocketJSONStream(ws);
        ShareDBServer.listen(stream);
    })

    server.listen(8080);
}

function createDoc(callback) {
    var connection = ShareDBServer.connect();
    var doc = connection.get('text-editor', 'text1');
    doc.fetch(err => {
        if (err) throw err;
        callback();
    })
}