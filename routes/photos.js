const bodyParser = require('body-parser');
const express = require('express');
const verifyAcc = require('../middleware/auth');
const {getAllPhotos,getAllPhotosByUserId, postPhoto, deletePhoto} = require('../controller/photos')
const multerMiddleware = require('../middleware/multerMiddleware')


require('dotenv').config()

const router = express.Router();

router.use(bodyParser.json());

router.get('/', getAllPhotos)

router.get('/:id', getAllPhotosByUserId)

router.post('/', verifyAcc, multerMiddleware, postPhoto)

router.delete('/:id', verifyAcc, deletePhoto)


module.exports = router;