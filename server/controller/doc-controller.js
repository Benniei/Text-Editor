var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
var connection = require('../db/shareDB.js')

var clients = {};
var requestBody = null;

connect = async (req, res) => {
    // If undefined IDs are passed through, skip function.
    if(req.params.uid === 'undefined') return res.status(400);
    const {docid, uid} = req.params;
    // Create the HTTP Stream
    const head = {
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
        "X-Accel-Buffering": "no"
    };
    res.set(head);
    // Return the contents of the operation
    var doc = connection.get('text-editor', docid);
    doc.subscribe(function(err) {
        if (err) throw err;
        doc.on('op', sendOpsToAll);
    });
    
    data = {
        content: doc.data.ops
    }
    res.write(`data: ${JSON.stringify(data)}\n\n`);

    const client = {
        uid: uid,
        res
    };
    // Checking if the connection to document exist
    if(clients[docid] !== undefined){
        // Add client to list of clients
        clients[docid] = clients[docid].filter(client => (client.id !== uid) || (!client.uid))
        clients.push(client)
    }
    // Make new list of clients for the document
    else{
        clients[docid] = []
        clients[docid].push(client)
    }

    

    // Handle connection closing
    req.on('close', () => {
        clients[docid] = clients[docid].filter(client => client.uid !== uid);
    })
}

operation = async (req, res) => {
    const op = req.body;
    const {docid, uid} = req.params;
    requestBody = req.body; // used as global variable

    var doc = connection.get('text-editor', docid);
    console.log("operation", op)
    if(!op){
        return res.end();
    }

    doc.submitOp(op, {source: docid})

    res.end();
}

function sendOpsToAll(op, id) {
    clients
        .filter(client => client.id !== id)
        .forEach(client => client.res.write(`data: ${JSON.stringify(requestBody)}\n\n`))
}

getdoc = async (req, res) => {
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