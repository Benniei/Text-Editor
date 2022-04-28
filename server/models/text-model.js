const mongoose = require('mongoose')
const mongoosastic = require('mongoosastic')
const Schema = mongoose.Schema

var DocumentSchema = new Schema(
    {
        name: { type: String, required: true, es_indexed: true},
        id: {type:String, required: true, es_indexed: true},
        content: {type: String, es_indexed:true}
    },
    {timestamps: true}
)

DocumentSchema.plugin(mongoosastic)

let Document = mongoose.model('Text', DocumentSchema)

Document.createMapping({
   "settings":{
      "analysis":{
         "analyzer":{
            "nGram_anal":{ 
               "type":"custom",
               "tokenizer":"nGram_token",
               "filter":[
                  "lowercase",
                  "asciifolding",
                  "english_stop"
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
                 "max_gram": 20,
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
         "analyzer": "nGram_anal",
         "search_analyzer": "stop_anal"
       },
       "content": {
         "type": "text",
         "analyzer": "nGram_anal",
         "search_analyzer": "stop_anal"
       }
     }
   }
 }, function(err, mapping){
    console.log("create mapping")
    if(err){
      console.log('error creating mapping (you can safely ignore this)');
      console.log(err);
    }else{
      console.log('mapping created!');
      console.log(mapping);
    }
});

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

module.exports = Document