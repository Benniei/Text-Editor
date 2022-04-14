var http = require('http');
var express = require('express');
var ShareDB = require('sharedb');
var mongodb = require('mongodb');
var richText = require('rich-text');
var WebSocket = require('ws');
var WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const dotenv = require('dotenv')
dotenv.config();
const db = require('sharedb-mongo')('mongodb://localhost:27017/editor-text');
ShareDB.types.register(richText.type);

var ShareDBServer = new ShareDB({db});
var wss;
startServer()

function startServer() {
    ip = process.env.IP
    var app = express();
    app.use(express.static('static'));
    app.use(express.static('node_modules/quill/dist'));
    
    var server = http.createServer(app);

    wss = new WebSocket.Server({ server: server }).on('connection', ws => {
        const stream = new WebSocketJSONStream(ws);
        ShareDBServer.listen(stream);
    })

    server.listen(4001, ip);
    console.log("ShareDB Server is running on " + ip + " port 4001");
}

function createDoc(document_name) {
    var connection = ShareDBServer.connect();
    var doc = connection.get('text-editor', 'text1');
    doc.fetch(err => {
        if (err) throw err;
        if (doc.type === null) {
            doc.create([], 'rich-text')
            console.log("Document " + document_name + " is created");
            return;
        }
    })
}