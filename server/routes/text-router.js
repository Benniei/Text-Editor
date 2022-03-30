const express = require('express')
const tictactoeController = require('../controller/text-controller')
const router = express.Router()

// Game
router.post('/connect/:id', tictactoeController.connect)
router.post('/op/:id', tictactoeController.operation)
router.get('/doc/:id', tictactoeController.getgame)


module.exports = router