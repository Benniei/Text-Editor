var ReconnectingWebSocket = require('reconnecting-websocket');
var richText = require('rich-text');
var sharedb = require('sharedb/lib/client');
const WS = require('ws');
var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
const dotenv = require('dotenv')
dotenv.config();

sharedb.types.register(richText.type);

var clients = [];
socketIP = '209.151.155.105'
// ShareDB Connection
var socket = new ReconnectingWebSocket('ws://' + socketIP + ':8080', [], { WebSocket: WS });
var connection = new sharedb.Connection(socket);

var requestBody = null;

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
        'Content-Type': 'text/event-stream',
        "X-Accel-Buffering": "no"
    };
    res.set(head);
    // Return the contents of the operation
    data = {
        content: doc.data.ops
    }
    res.write(`data: ${JSON.stringify(data)}\n\n`);


    // Create a unique connection
    const id = req.params.id;
    console.log("Connect: ", id);
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
    const op = req.body;
    requestBody = req.body
    console.log("operation", op)
    if(!op){
        return res.end();
    }
    if(op.length >= 1){
        op.forEach(operation => doc.submitOp(operation, {source: req.params.id}))
    }
    else{
        doc.submitOp(op, {source: req.params.id});
    }
    res.end();    
}

function sendOpsToAll(op, id) {
    clients
        .filter(client => client.id !== id)
        .forEach(client => client.res.write(`data: ${JSON.stringify(requestBody)}\n\n`))
}

getdoc = async (req, res) => {
    console.log("Getdoc: ", doc.data.ops);
    var convert = doc.data.ops;
    var cfg = {};
    var converted = new QuillDeltaToHtmlConverter(convert, cfg)
    var html = converted.convert()
    res.send(html)
}

alldoc = async (req, res) => {

}

rawConnect = async(req, res) => {
    // Create a unique connection
    const id = Math.floor(Math.random() * Date.now());

    res.redirect("http://" + '209.151.155.105' + ":3000/client/" + id)
}

module.exports = {
    connect,
    rawConnect,
    operation,
    getdoc,
    alldoc
}