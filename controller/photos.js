const jwt = require('jsonwebtoken');
const db = require('../database/dbConnection');


require('dotenv').config()

// function get all photos
const getAllPhotos = (req, res) => {
    db.query(`SELECT * FROM photos`, (err, result) => {
        if (err) throw err

        res.status(200).json({
            message: `All photo`,
            data: result
        })
    })
}

const getAllPhotosByUserId = (req, res) => {
    const id = req.params.id;
    db.query(`SELECT * FROM photos WHERE user_id = "${id}"`, (err, result) => {
        if (err) throw err

        res.status(200).json({
            message: `All photo from id ${id}`,
            data: result
        })
    })
}

const postPhoto = (req, res) => {
    const {title, caption} = req.body;
    const photo_url = req.file.path
    
    
    const {id} = jwt.verify(req.header('authorization').split(' ')[1], process.env.SECRET_TOKEN);

    db.query(`INSERT INTO photos (title, caption, photo_url, user_id)
        VALUES ("${title}", "${caption}", "${photo_url}", "${id}")`
        , (err, result) => {
            if (err) {
                res.status(400).json({
                    message: `error, make sure photo url is correct`
                })
            }

            db.query(`SELECT * FROM photos WHERE photo_url = "${photo_url}"`, (err, result) => {
                res.status(201).json({
                    message: `Upload photo successful`,
                    data: result
                })
            })

        })

}

module.exports = {getAllPhotos, getAllPhotosByUserId, postPhoto}