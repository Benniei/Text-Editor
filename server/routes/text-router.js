const express = require('express')
const auth = require('../auth')
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
router.post('/collection/create', auth.verify, CollectionController.createCollection)
router.post('/collection/delete', auth.verify, CollectionController.deleteCollection)
router.get('/collection/list', auth.verify, CollectionController.listCollection)

// Media Controller
router.post('/media/upload', auth.verify, MediaController.uploadMedia)
router.get('/media/access/:id', auth.verify, MediaController.accessMedia)

// Document Editing
router.get('/doc/connect/:docid/:uid', DocController.connect)
router.post('/doc/op/:docid/:uid', auth.verify, DocController.operation)
router.get('/doc/get/:docid/:uid', auth.verify, DocController.getdoc)
router.post('/doc/presence/:docid/:uid', auth.verify, DocController.presence)





module.exports = router