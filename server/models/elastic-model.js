const { Client } = require('@elastic/elasticsearch')

const client = new Client({
   node: 'http://209.151.151.166:9200'
 })

 module.exports = client

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