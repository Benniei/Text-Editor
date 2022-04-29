const mongoose = require('mongoose')
const mongoosastic = require('mongoosastic')
const Schema = mongoose.Schema
const { Client } = require('@elastic/elasticsearch')

const client = new Client({
   cloud: {
     id: 'https://cloud-peak.es.us-east-1.aws.found.io:9243'
   },
   auth: {
     username: 'elastic',
     password: 'qfpcdyKBHBNlZqk14GwfhNB9'
   }
 })

var DocumentSchema = new Schema(
    {
        name: { type: String, required: true, es_indexed: true},
        id: {type:String, required: true, es_indexed: true},
        content: {type: String, es_indexed:true}
    },
    {timestamps: true}
)

DocumentSchema.plugin(mongoosastic, {
    esClient: client
})

let Document = mongoose.model('Text', DocumentSchema)

// Document.createMapping(function(err, mapping){
//     console.log("create mapping")
//     if(err){
//       console.log('error creating mapping (you can safely ignore this)');
//       console.log(err);
//     }else{
//       console.log('mapping created!');
//       console.log(mapping);
//     }
//  });

/*
{
   "settings":{
      "analysis":{
         "analyzer":{
            "nGram_anal":{ 
               "type":"custom",
               "tokenizer":"nGram_token",
               "filter":[
                  "lowercase",
                  "asciifolding"
               ]
            },
            "stop_anal":{ 
               "type":"custom",
               "tokenizer":"whitespace",
               "filter":[
                  "lowercase",
                  "english_stop",
                  "stemmer",
                  "asciifolding"
               ]
            }
         },
         "filter":{
            "english_stop":{
               "type":"stop",
               "stopwords":"_english_"
            }
         },
         "tokenizer": {
           "nGram_token": {
                 "type": "edge_ngram",
                 "min_gram": 3,
                 "max_gram": 10,
                 "token_chars": [
                   "letter",
                   "digit"
                 ]
            }
         }
      }
   },
   "mappings":{
     "properties":{
       "name": {
         "type": "text",
         "analyzer": "nGram_anal"
       },
       "content": {
         "type": "text",
         "analyzer": "nGram_anal"
       }
     }
   }
 }
*/

let stream = Document.synchronize();

var count = 0;
stream.on('data', function(err, doc){
  count++;
});
stream.on('close', function(){
  console.log('indexed ' + count + ' documents!');
});
stream.on('error', function(err){
  console.log(err);
});

module.exports = Document
