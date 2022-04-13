const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        id: {type:String, required: true},
        updateCounter: {type: Number},
    },
    {timestamps: true}
)

module.exports = mongoose.model('Text', UserSchema)