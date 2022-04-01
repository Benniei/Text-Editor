const document = require('../models/document-model.js')

connect = async (req, res) => {
    return res.status(200).json({success: true});
}

operation = async (req, res) => {
    console.log("operations")
    console.log(req.params)

    console.log(JSON.stringify(req.body.data))
    return res.status(200).json({success: true});
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