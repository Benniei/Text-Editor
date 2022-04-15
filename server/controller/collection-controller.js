var connection = require('../db/shareDB.js')
var MongoClient = require('mongodb').MongoClient;
const Text = require('../models/text-model')

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
    console.log("-------------createCollection")
    const {name} = req.body
    // need to do name to ID mapping
    newID = id()
    var doc = connection.get('text-editor', newID);
    doc.fetch(err => {
        if (err) throw err;
        if (doc.type === null) {
            doc.create({name: name}, 'rich-text')
            new Text({
                name: name,
                id: newID
            }).save()
            return;
        }
    })
    
    res.status(200).json({
        status: "OK",
        docid: doc.id,
        name: name
    })
}

deleteCollection = async (req, res) => {
    console.log("-------------deleteCollection")
    const {docid} = req.body
    var textquery = {_id: docid}
    var opquery = {d: docid}
    Text.findOneAndDelete({ id: docid }, () => {
        
    })
    myDb.db("editor-text").collection("text-editor").deleteOne(textquery, function(err, obj) {
        if (err) throw err;
    });
    myDb.db("editor-text").collection("o_text-editor").deleteOne(opquery, function(err, obj) {
        if (err) throw err;
    });
    console.log("Delete: " + docid)
    res.status(200).json({
        status: "OK"
    });
}

listCollection = async (req, res) => {
    console.log("-------------listCollection")
    finalList = []
    idList = []
    textEditor = myDb.db("editor-text").collection("text-editor")

    var sort = textEditor.find().sort({"_m.mtime": -1}).limit(10).toArray(function(err, result) {
        result.forEach(key => idList.push(key.docid))
        Text.find({
            'docid': { $in: idList}
        }, function(err, docs){
            for (var i=0; i < result.length; i++){
                var cors = docs.find(element => element.id === result[i]._id);
                finalList.push({name: cors.name, docid: result[i]._id, time: result[i]._m.mtime})
            }
            res.status(200);
            res.json(finalList)
            res.end()
        });
    });
}

module.exports = {
    createCollection,
    deleteCollection,
    listCollection
}