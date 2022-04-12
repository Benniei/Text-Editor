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
router.get('/users/verify', UserController.verifyUser)
router.get('/user/loggedIn', UserController.userLoggedIn)

// Collection Creation
router.post('/collection/create', CollectionController.createCollection)
router.post('/collection/delete', CollectionController.deleteCollection)
router.get('/collection/list', CollectionController.listCollection)

// Media Controller
router.post('/media/upload', MediaController.uploadMedia)
router.get('/media/access/:id', MediaController.accessMedia)

// Document Editing
router.get('/doc/connect/:docid/:uid', DocController.connect)
router.post('/doc/op/:docid/:uid', DocController.operation)
router.get('/doc/get/:docid/:uid', DocController.getdoc)
router.post('/doc/presence/:docid/:uid', DocController.presence)





module.exports = router