var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
var connection = require('../db/shareDB.js')

var clients = {};
var requestBody = null;
var flag = false;
connect = async (req, res) => {
    console.log("-------------connect")
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
    // var presenceConnection = connection.getDocPresence('text-editor', docid);
    doc.subscribe(function(err) {
        if (err) throw err;
        doc.on('op', sendOpsToAll);
    });
    // presenceConnection.subscribe( function(err){
    //     if(err) throw err;
    //     presenceConnection.on('presence', sendPrescenceToAll);
    // })

    doc.fetch(err => {
        if (err) throw err;
        console.log(doc.data.ops)
        res.write(`data: ${JSON.stringify(doc.data.ops)}\n\n`);
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
    console.log("-------------operation")
    const {op, version} = req.body;
    const {docid, uid} = req.params;
    
    flag = true
    var doc = connection.get('text-editor', docid);
    var docVersion = doc.version;
    if(docVersion > version) {
        const failed = {
            status: "retry",
            ack: op
        }
        clients[docid][uid].res.write(`data: ${JSON.stringify(failed)}\n\n`);
    }
    const success = {
        status: "ok",
        ack: op,
        version: doc.version
    }
    clients[docid][uid].res.write(`data: ${JSON.stringify(success)}\n\n`);

    requestBody = {content: req.body.op, version: doc.version, first: false}; // used as global variable
    console.log("operation", op)
    if(!op){
        return res.end();
    }
    const ids = [docid, uid]
    doc.submitOp(op, {source: ids})
    return res.json({status: "ok"}).end()
}

function sendOpsToAll(op, ids) {
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

function sendPrescenceToAll(presence, ids) {
    
    let conns = clients[ids["docid"]] // gets the map for all clients with document ID
    for (const key in conns) {
        if(key === ids["uid"])
            continue
        client = conns[key]
        data = {
            presence: presence
        }
        client.res.write(`data: ${JSON.stringify(data)}\n\n`)
    }

}

getdoc = async (req, res) => {
    console.log("-------------getdoc")
    const {docid, uid} = req.params;
    var doc = connection.get('text-editor', docid);
    var convert = doc.data.ops;
    var cfg = {};
    var converted = new QuillDeltaToHtmlConverter(convert, cfg)
    var html = converted.convert()
    console.log(html)
    res.send(html);
}

presence = async (req, res) => {
    // var presenceConnection = connection.getDocPresence('text-editor', docid);
    // const localPresence = presenceConnection.create()
    // console.log(data)
    // localPresence.submit(data)
    data = {
        index: req.body.index,
        length: req.body.length,
        name: req.body.name,
        uid: req.params.uid
    }
    sendPrescenceToAll(data, req.params)
    return res.status(200).json({
        status: "OK",
        ack: req.body
    }).end()
}

module.exports = {
    connect,
    operation,
    getdoc,
    presence
}