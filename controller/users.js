const validator = require("email-validator");
const jwt = require('jsonwebtoken');
const db = require('../database/dbConnection');
const bcrypt = require('bcrypt');

require('dotenv').config();


//function register user
const registerUser = (req, res) => {
    const {username, email, password} = req.body
    
    //validation
    if (!(validator.validate(email)) || !email){return res.status(400).json({message: "Invalid email"})}
    if (!username) {return res.status(400).json({message: "Please input username"})}
    if (!password || password.length < 6) {return res.status(400).json({message: "Password should be at least 6 characters"})}
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    
    const sqlInput = `INSERT INTO  users (username, email, password)
                VALUES ("${username}", "${email}", "${hash}")`
    db.query(sqlInput, (err, result) => {
        if (err) {
            return res.status(400).json({
                message: `username not available`
            })
        } else {
            db.query(`SELECT id, username, created_at FROM users where username = "${username}"`, (err, result) => {
                    return res.json({
                        message:`Register succesfully`,
                        data: result[0]
                    })
                })
        }
    })

    // db.query(`SELECT id, username, created_at FROM users where username = "${username}"`, (err, result) => {
    //     return res.json({
    //         message:`Register succesfully`,
    //         data: result[0]
    //     })
    // })
    // console.log('pass')
}

//function login user
const loginUser = (req, res) => {
    const {username, password} = req.body
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

    db.query(`SELECT * FROM users where username = "${username}"`, (err, result) => {
        if (err) throw err

        if (result.length == 0) {return res.status(400).json({
            message: `Doesn't have account? Please register!`
        })}

        if (!(bcrypt.compareSync(password, result[0].password))) { return res.status(400).json({
            message: `Forgot password?`
        })}

        const token = jwt.sign({id: result[0].id}, process.env.SECRET_TOKEN, {expiresIn: '4h'})
        res.status(200).json({
            message: `Login successful`,
            token: token
        })
    })
}

//functuon delete user
const deleteUser = (req,res) =>{
    
    const {id} = jwt.verify(req.header('authorization').split(' ')[1], process.env.SECRET_TOKEN);

    db.query(`DELETE FROM photos WHERE user_id = "${id}"`, (err, result) => {
        if (err) throw err
    })
    db.query(`DELETE FROM users WHERE id = "${id}"`, (err, result) => {
        if (err) throw err
        res.status(200).json({
            message: `your account has been deleted`
        })
    })
}

module.exports = {registerUser, loginUser, deleteUser}