const jwt = require('jsonwebtoken');
const db = require('../database/dbConnection');
require('dotenv').config()



const verifyAcc = (req,res, next) =>{
    token = req.header('Bearer-token');

    if(!token){return res.status(401).json({message: "Access token is required, please login to get access token"})}

    try{
        const {username, password} = jwt.verify(token, process.env.SECRET_TOKEN);

        db.query(`SELECT * FROM users where username = "${username}"`, (err, result) => {
            if (err) throw err
    
            if (result.length == 0) {return res.status(400).json({
                message: `Please register first`
            })}
    
            if (result[0].password !== password) { return res.status(400).json({
                message: `Invalid token`
            })}
        })

        next()
    } catch (error){
        res.status(400).json({message: "Invalid token"})
    }

}

module.exports = verifyAcc