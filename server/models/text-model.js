const mongoose = require('mongoose')
const mongoosastic = require('mongoosastic')
const Schema = mongoose.Schema

var DocumentSchema = new Schema(
    {
        name: { type: String, required: true, es_indexed: true},
        id: {type:String, required: true, es_indexed: true},
        content: {type: String, es_indexed: true}
    },
    {timestamps: true}
)

DocumentSchema.plugin(mongoosastic)

let Document = mongoose.model('Text', DocumentSchema)

Document.createMapping(function(err, mapping){
    console.log("create mapping")
    if(err){
      console.log('error creating mapping (you can safely ignore this)');
      console.log(err);
    }else{
      console.log('mapping created!');
      console.log(mapping);
    }
});

module.exports = Document