var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
var connection = require('../db/shareDB.js')

var clients = [];
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
    requestBody = req.body; // used as global variable
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

presence = async (req, res) => {

}

module.exports = {
    connect,
    operation,
    getdoc,
    presence
}