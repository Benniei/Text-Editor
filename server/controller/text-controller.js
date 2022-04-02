const document = require('../models/document-model.js')

var clients = [];
var ops = [];

connect = async (req, res) => {
    // Create the HTTP Stream
    const head = {
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream'
    };
    res.writeHead(200, head);

    // Return the contents of the operation
    // const data = `data: ${JSON.stringify(ops)}`
    // res.write(data);

    // Create a unique connection
    const id = req.params.id;
    const client = {
        id: id,
        res
    };
    clients.push(client);

    // Handle connection closing
    req.on('close', () => {
        clients = clients.filter(client => client.id !== id);
    })
}

rawConnect = async(req, res) => {
    // Create the HTTP Stream
    const head = {
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream'
    };
    res.writeHead(200, head);

    // Return the list of operations.
    const data = `data: ${JSON.stringify(ops)}`
    res.write(data);

    // Create a unique connection
    const id = Math.floor(Math.random() * Date.now());
    const client = {
        id: id,
        res
    };
    clients.push(client);

    // Handle connection closing
    req.on('close', () => {
        clients = clients.filter(client => client.id !== id);
    })
}

operation = async (req, res) => {
    const op = req.body.data;
    ops.push(op.ops);
    res.json(op);
    return sendOpsToAll(op, req.params.id);
}

function sendOpsToAll(op, id) {
    data = {
        data: ops
    }
    console.log(ops)
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