const express = require('express')
const textController = require('../controller/text-controller')
const router = express.Router()

// Game
router.post('/connect/:id', text.connect)
router.post('/op/:id', text.operation)
router.get('/doc/:id', text.getdoc)
router.get('/alldoc', text.alldoc)


module.exports = router