const mongoose = require('mongoose')
const mongoosastic = require('mongoosastic')
const Schema = mongoose.Schema

var DocumentSchema = new Schema(
    {
        name: { type: String, required: true},
        id: {type:String, required: true},
        content: {type: String}
    },
    {timestamps: true}
)

module.exports = mongoose.model('Text', DocumentSchema)