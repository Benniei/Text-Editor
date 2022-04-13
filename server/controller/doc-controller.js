var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
var connection = require('../db/shareDB.js')

var clients = {};
var requestBody = null;
var flag = false;
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
    console.log(docid, uid);
    var doc = connection.get('text-editor', docid);
    doc.subscribe(function(err) {
        if (err) throw err;
        doc.on('op', sendOpsToAll);
    });
    await doc.fetch(err => {
        if (err) throw err;
        
        data = {
            content: doc.data.ops
        }
        res.write(`data: ${JSON.stringify(data)}\n\n`);
        return;
    })

    const client = {
        uid: uid,
        doc: doc,
        docid: docid,
        res
    };
    // Checking if the connection to document exist
    if(clients[docid] !== undefined){
        // Add client to list of clients
        clients[docid][uid] = client
    }
    // Make new list of clients for the document
    else{
        clients[docid] = {}
        clients[docid][uid] = client
    }
    
    // Handle connection closing
    req.on('close', () => {
        delete clients[docid][uid]
    })
}

operation = async (req, res) => {
    const op = req.body;
    const {docid, uid} = req.params;
    requestBody = req.body; // used as global variable
    flag = true
    var doc = connection.get('text-editor', docid);
    console.log("operation", op)
    if(!op){
        return res.end();
    }
    const ids = [docid, uid]
    doc.submitOp(op, {source: ids})
    res.end();
}

function sendOpsToAll(op, ids) {
    // clients
    //     .filter(client => client.id !== id)
    //     .forEach(client => client.res.write(`data: ${JSON.stringify(requestBody)}\n\n`))
    if(flag === true){
        let conns = clients[ids[0]] // gets the map for all clients with document ID
        for (const key in conns) {
            if(key === ids[1])
                continue
            client = conns[key]
            client.res.write(`data: ${JSON.stringify(requestBody)}\n\n`)
        }
    }
    flag = false
}

getdoc = async (req, res) => {
    const {docid, uid} = req.params;
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