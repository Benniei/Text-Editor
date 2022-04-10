const express = require('express')
const textController = require('../controller/text-controller')
const UserController = require('../controller/user-controller')
const router = express.Router()

// Text Editing
router.get('/connect/:id', textController.connect)
router.get('/connect', textController.rawConnect)
router.post('/op/:id', textController.operation)
router.get('/doc/:id', textController.getdoc)
router.get('/alldoc', textController.alldoc)

// User Authentication
router.post('/adduser', UserController.registerUser)
router.post('/login', UserController.loginUser)
router.post('/logout', UserController.logoutUser)


module.exports = router