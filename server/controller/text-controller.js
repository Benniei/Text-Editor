const document = require('../models/document-model.js')

var clients = [];
var ops = [];

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
        data: ops
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
    ops.push(op.ops);
    res.json(op);
    res.end();
    return sendOpsToAll(op, req.params.id);
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