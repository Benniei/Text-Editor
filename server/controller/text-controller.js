var ReconnectingWebSocket = require('reconnecting-websocket');
var sharedb = require('sharedb/lib/client');
const WS = require('ws');

var clients = [];

// ShareDB Connection
var socket = new ReconnectingWebSocket('ws://localhost:8080', [], { WebSocket: WS });
var connection = new sharedb.Connection(socket);

var doc = connection.get('text-editor', 'text1');
doc.subscribe(function(err) {
    if (err) throw err;
    doc.on('op', sendOpsToAll);
});

connect = async (req, res) => {
    // If undefined IDs are passed through, skip function.
    if(req.params.id === 'undefined') return;
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

rawConnect = async(req, res) => {
    // Create a unique connection
    const id = Math.floor(Math.random() * Date.now());

    res.redirect("http://localhost:3000/connect/" + id)
}

operation = async (req, res) => {
    const op = req.body.data;
    res.json(op);
    doc.submitOp(op, {source: req.body.id});
}

function sendOpsToAll(op, id) {
    data = {
        data: op.ops
    }
    // clients.map((client) => console.log(client.id))
    console.log(data)
    clients
        .filter(client => client.id !== id)
        .forEach(client => client.res.write(`data: ${JSON.stringify(data)}\n\n`))
}

getdoc = async (req, res) => {
    res.send("uwu " + req.params.id)
}

alldoc = async (req, res) => {

}

module.exports = {
    connect,
    rawConnect,
    operation,
    getdoc,
    alldoc
}