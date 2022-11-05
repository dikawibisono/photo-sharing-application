const express = require('express');
const bodyParser = require('body-parser');
const { postComment, getComments, deleteComment } = require('../controller/comments');
const verifyAcc = require('../middleware/auth');

const router = express.Router();

router.use(bodyParser.json());

router.post('/', verifyAcc, postComment);

router.get('/', verifyAcc, getComments)

router.delete('/', verifyAcc, deleteComment)


module.exports = router;