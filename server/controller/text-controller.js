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

    // Return the list of operations.
    const data = `data: ${JSON.stringify(ops)}\n\n`
    res.write(data);

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

//     // Look for a persistent document
//     await document.findById({ _id: req.params.id }, (err, doc) => {
//         // If not found, create new persistent document and return.
//         if (err || !doc) {
//             const body = { html: '<p></p>' };
//             doc = new document(body);
//             doc
//                 .save()
//                 .then(() => {
//                     res.write(`doc: ${doc}\n\n`);
//                 });
//         } else { res.write(`doc: ${doc}\n\n`); }
        
//     }).catch(err => console.log(err))
}

operation = async (req, res) => {
    console.log("operations")
    console.log(req.params)
    console.log(JSON.stringify(req.body.data))

    const op = req.body.data;
    ops.push(op);
    res.json(op);
    return sendOpsToAll(op, req.params.id);
}

function sendOpsToAll(op, id) {
    clients
        .filter(client => client.id !== id)
        .forEach(client => client.res.write(`data: ${JSON.stringify(op)}\n\n`))
}

getdoc = async (req, res) => {
    res.send("uwu " + req.params.id)
}

alldoc = async (req, res) => {

}

module.exports = {
    connect,
    operation,
    getdoc,
    alldoc
}