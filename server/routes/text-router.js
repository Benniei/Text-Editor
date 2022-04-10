const express = require('express')
const textController = require('../controller/text-controller')
const UserController = require('../controller/user-controller')
const router = express.Router()

// Game
router.get('/connect/:id', textController.connect)
router.get('/connect', textController.rawConnect)
router.post('/op/:id', textController.operation)
router.get('/doc/:id', textController.getdoc)
router.get('/alldoc', textController.alldoc)


module.exports = router