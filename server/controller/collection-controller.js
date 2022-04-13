var connection = require('../db/shareDB.js')
var MongoClient = require('mongodb').MongoClient;

const uri = "mongodb://127.0.0.1:27017/";
var myDb;
MongoClient.connect(uri, function(err, database) {
    if(err) throw err;
    myDb = database;
})

const id = function() {
    return Math.random().toString(36).substr(2, 15) + Math.random().toString(36).substr(2, 15);
  };
  

createCollection = async (req, res) => {
    const {name} = req.body
    // need to do name to ID mapping
    newID = id()
    var doc = connection.get('text-editor', newID);
    doc.fetch(err => {
        if (err) throw err;
        if (doc.type === null) {
            doc.create({name: name})
            console.log("Document " + name + " is created");
            return;
        }
    })
    res.status(200).json({
        docid: doc.id
    })
}

deleteCollection = async (req, res) => {
    const {docid} = req.body
    var textquery = {_id: docid}
    var opquery = {d: docid}
    myDb.db("editor-text").collection("text-editor").deleteOne(textquery, function(err, obj) {
        if (err) throw err;
    });
    myDb.db("editor-text").collection("o_text-editor").deleteOne(opquery, function(err, obj) {
        if (err) throw err;
    });
    console.log("Delete: " + docid)
    res.status(200).json({});
}

listCollection = async (req, res) => {
    finalList = []
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("editor-text");
        textEditor = dbo.collection("text-editor")
        var sort = textEditor.find().sort({"_m.ctime": -1}).limit(10).toArray(function(err, result) {
            result.forEach(res => finalList.push({name: res.name, id: res._id, time: res._m.ctime}))
            res.status(200)
            res.write(`data: ${JSON.stringify(finalList)}\n\n`);
            db.close();
            res.end()
        });
    });
}

module.exports = {
    createCollection,
    deleteCollection,
    listCollection
}