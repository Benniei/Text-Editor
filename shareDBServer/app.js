var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
//var MongoDB = require('mongodb');
var richText = require('rich-text');
var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const dotenv = require('dotenv')
dotenv.config();

ShareDB.types.register(richText.type);
const db = require('sharedb-mongo')('mongodb://localhost:27017/test', {mongoOptions: {...}});
var ShareDBServer = new ShareDB({db});
createDoc(startServer);

function startServer() {
    ip = process.env.IP
    var app = express();
    app.use(express.static('static'));
    app.use(express.static('node_modules/quill/dist'));
    
    var server = http.createServer(app);

    var wss = new WebSocket.Server({ server: server }).on('connection', ws => {
        const stream = new WebSocketJSONStream(ws);
        ShareDBServer.listen(stream);
    })

    server.listen(4001, ip);
    console.log("ShareDB Server is running on " + ip + " port 8080");
}

function createDoc(callback) {
    var connection = ShareDBServer.connect();
    var doc = connection.get('text-editor', 'text1');
    doc.fetch(err => {
        if (err) throw err;
        if (doc.type === null) {
            doc.create([], 'rich-text', callback)
            console.log("Document is created");
            return;
        }
        callback();
    })
}