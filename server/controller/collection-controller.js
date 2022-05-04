var connection = require('../db/shareDB.js')
var MongoClient = require('mongodb').MongoClient;
const Text = require('../models/text-model')
const ElasticClient = require('../models/elastic-model')
const dotenv = require('dotenv')

const uri = "mongodb://209.151.150.113:27017/";
var myDb;
MongoClient.connect(uri, function(err, database) {
    if(err) throw err;
    myDb = database;
})

const id = function() {
    return Math.floor(Math.random() * Date.now());
  };
  

createCollection = async (req, res) => {
    console.log("-------------createCollection")
    const {name} = req.body
    // need to do name to ID mapping
    
    var serverNumber = Math.floor(Math.random() * process.env.NUM_SERVER);
    var newID = "s" + serverNumber + "-" + id().toString()
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
    await ElasticClient.index({
        index: 'texts',
        id: doc.id,
        document: {
            name: name,
            docid: doc.id
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
    const document = await Text.findOneAndDelete({ id: docid })
    document.remove();
    myDb.db("editor-text").collection("text-editor").deleteOne(textquery, function(err, obj) {
        if (err) throw err;
    });
    myDb.db("editor-text").collection("o_text-editor").deleteMany(opquery, function(err, obj) {
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
        // Text.search({}, function(err, results) {
        //     console.log(results)
        // })
        Text.find({
            'docid': { $in: idList}
        }, function(err, docs){
            for (var i=0; i < result.length; i++){
                var cors = docs.find(element => element.id === result[i]._id);
                finalList.push({name: cors.name, docid: result[i]._id, time: result[i]._m.mtime})
            }

            res.status(200).json(finalList).end();
        });
    });
}

module.exports = {
    createCollection,
    deleteCollection,
    listCollection
}
