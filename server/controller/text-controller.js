const document = require('../models/document-model.js')

connect = async (req, res) => {

}

operation = async (req, res) => {
    console.log("operations")
    console.log(req.params)
    console.log(req.body)
}

getdoc = async (req, res) => {
    res.send("uwu " + req.params.id)
}

alldoc = async (req, res) => {

}

module.exports = {
    connect,
    operation,
    getdoc,
    alldoc
}