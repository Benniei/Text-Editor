var connection = require('../db/shareDB.js')
var MongoClient = require('mongodb').MongoClient;

const uri = "mongodb://127.0.0.1:27017/";

const id = function() {
    return Math.random()
      .toString(36)
      .substr(2, 15);
  };
  

createCollection = async (req, res) => {
    const {name} = req.body
    // need to do name to ID mapping
    newID = id()
    var doc = connection.get('text-editor', newID);
    doc.fetch(err => {
        if (err) throw err;
        if (doc.type === null) {
            doc.create({name: "hello"})
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
    var query = {d: 'text1'}
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        var dbo = db.db("editor-text");
        textEditor = dbo.collection("text-editor")
        operationsText = dbo.collection("o_text-editor")
        operationsText.deleteOne(query, function(err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });
    res.status(200);
}

listCollection = async (req, res) => {
}

module.exports = {
    createCollection,
    deleteCollection,
    listCollection
}