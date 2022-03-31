const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DocumentSchema = new Schema(
    {
        html: { type: String, required: true },
        data: { type: [Object], required: false}
    }
)

module.exports = mongoose.model('Document', DocumentSchema)
