var QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
var connection = require('../db/shareDB.js')
const auth = require('../auth')
const jwt = require('jsonwebtoken')
const Text = require('../models/text-model')
const ElasticClient = require('../models/elastic-model')
const dotenv = require('dotenv')

var clients = {};
var versionGlo = {};
var changedDocuments = [];
var requestBody = null;
var flag = false;

function redirect(docid) {
    var docMod = parseInt(docid) % 3;
    return "430" + docMod
}

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

    doc.subscribe(function(err) {
        if (err) throw err;
        doc.on('op', sendOpsToAll);
    });

    doc.fetch(err => {
        if (err) throw err;
        var back = {
            content: doc.data.ops,
            version: versionGlo[docid]
        }
        res.write(`data: ${JSON.stringify(back)}\n\n`);
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
        versionGlo[docid] = 1
    }
    // Handle connection closing
    req.on('close', () => {
        delete clients[docid][uid]
    })
}

operation = async (req, res) => {
    console.log("-------------operation")
    const {op, insert, version} = req.body;
    const {docid, uid} = req.params;

    if(insert)
        return res.json({status: "ok", ack: op, version: docVersion})
    if(!op) return res.status(400);

    flag = true
    var doc = connection.get('text-editor', docid);
    var docVersion = versionGlo[docid];
    
    console.log("operation", docid, uid, op, version, docVersion)
    if(docVersion > version) {
        return res.json({status: "retry", ack: op, version: docVersion})
    }
    else {
        const success = {
            status: "ok",
            ack: op
        }
        clients[docid][uid].res.write(`data: ${JSON.stringify(success)}\n\n`);
        requestBody = req.body.op; // used as global variable

        const ids = [docid, uid]
        
        doc.submitOp(op, {source: ids})
        versionGlo[docid] = versionGlo[docid] + 1;

        // Add item to queue
        if(changedDocuments.indexOf(docid) < 0){
            changedDocuments.push(docid);
        }
        return res.json({status: "ok", ack: op, version: docVersion})
    }
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
        const pres = {
            index: presence.index,
            length: presence.length,
            name: presence.name
        }
        data = {
            id: presence.uid,
            cursor: pres
        }
        const finalpresence = {
            presence: data
        }
        client.res.write(`data: ${JSON.stringify(finalpresence)}\n\n`)
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
    res.send(html);
}

// async function to add keys to elastic search
(async function dequeueChanges() {
  // Dequeue from array
  var docid;
  if((docid = changedDocuments.shift())){
        var doc = connection.get('text-editor', docid);
        var convert = doc.data.ops;
        var cfg = {};
        var converted = new QuillDeltaToHtmlConverter(convert, cfg)
        var html = converted.convert()
        var item = html.replace(/<(.|\n)*?>/g, '');
	    console.log("----------updating " + docid)
        await ElasticClient.update({
            index: 'texts',
            id: docid,
            body: { 
                doc: {
                    content: item
                }
            }
        })
  }
  setTimeout( dequeueChanges, 50 );
})();

presence = async (req, res) => {
    const {docid, uid} = req.params;
    
    var userName;
    auth.verify(req, res, async function () {
        let verified = null;
        let loggedInUser = null;
        if(req.cookies.token) {
            verified = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            userName = verified.name;
        }})
    data = {
        index: req.body.index,
        length: req.body.length,
        name: userName,
        uid: uid
    }
    sendPrescenceToAll(data, req.params)
    return res.status(200).json({
        status: "ok",
        ack: req.body
    }).end()
}

module.exports = {
    connect,
    operation,
    getdoc,
    presence
}
