const express = require('express')
const UserController = require('../controller/user-controller')
const CollectionController = require('../controller/collection-controller')
const MediaController = require('../controller/media-controller')
const DocController = require('../controller/doc-controller')

const router = express.Router()

// User Authentication
router.post('/users/signup', UserController.registerUser)
router.post('/users/login', UserController.loginUser)
router.post('/users/logout', UserController.logoutUser)
router.post('/users/verify', UserController.verifyUser)
router.get('/user/loggedIn', UserController.userLoggedIn)

// Collection Creation
router.post('/collection/create', CollectionController.createCollection)
router.post('/collection/delete', CollectionController.deleteCollection)
router.post('/collection/list', CollectionController.listCollection)

// Media Controller
router.post('/media/upload', MediaController.uploadMedia)
router.post('/media/access/:id', MediaController.accessMedia)

// Document Editing
router.get('/doc/connect/:id', DocController.connect)
router.post('/doc/op/:id', DocController.operation)
router.get('/doc/get/:id', DocController.getdoc)
router.get('/doc/presence/:id', DocController.presence)





module.exports = router