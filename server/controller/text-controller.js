const document = require('../models/document-model.js')

connect = async (req, res) => {
    
}

operation = async (req, res) => {

}

getgame = async (req, res) => {
    res.send("uwu " + req.params.id)
}

module.exports = {
    connect,
    operation,
    getgame
}