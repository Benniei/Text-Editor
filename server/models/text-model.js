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
           "myanal":{ 
              "type":"custom",
              "tokenizer":"standard",
              "filter":[
                 "lowercase"
              ]
           },
           "stopanal":{ 
              "type":"custom",
              "tokenizer":"standard",
              "filter":[
                 "lowercase",
                 "english_stop",
                 "stemmer"
              ]
           }
        },
        "filter":{
           "english_stop":{
              "type":"stop",
              "stopwords":"_english_"
           }
        }
     }
  },
  "mappings":{
      "properties":{
         "title": {
            "type":"text",
            "analyzer":"myanal", 
            "search_analyzer":"stopanal", 
            "search_quote_analyzer":"myanal" 
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

let stream = Document.synchronize();

module.exports = Document