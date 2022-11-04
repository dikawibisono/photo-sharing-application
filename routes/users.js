const express = require('express');
const bodyParser = require('body-parser');
const verifyAcc = require('../middleware/auth');
const {registerUser, loginUser, deleteUser} = require('../controller/users')
const router = express.Router();


router.use(bodyParser.json());


router.post('/register', registerUser)

router.post('/login', loginUser)

router.delete('/', verifyAcc, deleteUser)


router.get('/login', verifyAcc, (req, res) => {
    res.status(200).json({message: "nyoba aja"})
})

module.exports = router;