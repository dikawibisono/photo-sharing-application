const express = require('express');
const validator = require("email-validator");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const verfiyAcc = require('../controller/auth')

require('dotenv').config()

const db = require('../database/dbConnection');


const router = express.Router();

router.use(bodyParser.json());

router.post('/register', (req, res) => {
    const {username, email, password} = req.body

    //validation
    if (!(validator.validate(email)) || !email){return res.status(400).json({message: "Invalid email"})}
    if (!username) {return res.status(400).json({message: "jangan lupa username boy"})}
    if (!password || password.length < 6) {return res.status(400).json({message: "Password should be at least 6 characters"})}

    
    const sqlInput = `INSERT INTO  users (username, email, password)
                VALUES ("${username}", "${email}", "${password}")`
    db.query(sqlInput, (err, result) => {
        if (err) {
            res.json({
                message: `username not available`
            })
        }
    })
    db.query(`SELECT id, username, created_at FROM users where username = "${username}"`, (err, result) => {
        res.status(200).json(result)
    })

})

router.post('/login', (req, res) => {
    const {username, password} = req.body

    db.query(`SELECT * FROM users where username = "${username}"`, (err, result) => {
        if (err) throw err

        if (result.length == 0) {return res.status(400).json({
            message: `Doesn't have account? Please register!`
        })}

        if (result[0].password !== password) { return res.status(400).json({
            message: `Forgot password?`
        })}

        const token = jwt.sign({username: username, password: password}, process.env.SECRET_TOKEN)
        res.status(200).header('Bearer-token', token).json({
            message: token
        })
    })


})

router.delete('/', verfiyAcc, (req,res) =>{
    // const id = req.params.id
    token = req.header('Bearer-token');
    const {username, password} = jwt.verify(token, process.env.SECRET_TOKEN);

    db.query(`DELETE FROM users WHERE username = "${username}"`, (err, result) => {
        if (err) throw err
        res.status(200).json({
            message: `account with username ${username} has been deleted`
        })
    })

})


module.exports = router;