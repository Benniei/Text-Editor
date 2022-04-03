var ReconnectingWebSocket = require('reconnecting-websocket');
var richText = require('rich-text');
var sharedb = require('sharedb/lib/client');
const WS = require('ws');
var renderer  = require('quilljs-renderer');
var Converter  = renderer.Document;
renderer.loadFormat('html');
const dotenv = require('dotenv')
dotenv.config();

sharedb.types.register(richText.type);

var clients = [];
socketIP = '209.151.155.105'
// ShareDB Connection
var socket = new ReconnectingWebSocket('ws://' + socketIP + ':8080', [], { WebSocket: WS });
var connection = new sharedb.Connection(socket);

var doc = connection.get('text-editor', 'text1');
doc.subscribe(function(err) {
    if (err) throw err;
    doc.on('op', sendOpsToAll);
});

connect = async (req, res) => {
    // If undefined IDs are passed through, skip function.
    if(req.params.id === 'undefined') return res.status(400);
    // Create the HTTP Stream
    const head = {
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream'
    };
    res.writeHead(200, head);

    // Return the contents of the operation
    data = {
        content: doc.data
    }
    res.write(`data: ${JSON.stringify(data)}\n\n`);

    // Create a unique connection
    const id = req.params.id;
    const client = {
        id: id,
        res
    };

    clients = clients.filter(client => (client.id !== id) || (!client.id))
    clients.push(client)

    // Handle connection closing
    req.on('close', () => {
        clients = clients.filter(client => client.id !== id);
    })
}

operation = async (req, res) => {
    const op = req.body.data;
    doc.submitOp(op, {source: req.params.id});
    res.end();
}

function sendOpsToAll(op, id) {
    clients
        .filter(client => client.id !== id)
        .forEach(client => client.res.write(`data: ${JSON.stringify(op)}\n\n`))
}

getdoc = async (req, res) => {
    if(!doc.data){
        return res.send("<p></p>")
    }
    let convert = new Converter(doc.data)
    let html = convert.convertTo('html', {
        line: '<p>{content}</p>',
        styleTags: {
            bold: '<strong>{content}</strong>',
            italic: '<em>{content}</em>'
        }
    })
    res.send(html)
}

alldoc = async (req, res) => {

}

rawConnect = async(req, res) => {
    // Create a unique connection
    const id = Math.floor(Math.random() * Date.now());

    res.redirect("http://" + '209.151.155.105' + ":3000/connect/" + id)
}

module.exports = {
    connect,
    rawConnect,
    operation,
    getdoc,
    alldoc
}