const jwt = require('jsonwebtoken');
require('dotenv').config()

const verifyAcc = (req,res, next) =>{
    
    try {
    jwt.verify(req.header('authorization').split(' ')[1], process.env.SECRET_TOKEN)
    next()
    } catch (e) {
    res.status(401).json({
        message: "unauthorized, please login!"
    })
    }
}

module.exports = verifyAcc