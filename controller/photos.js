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

//function get all photos by user id
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

//function post photo
const postPhoto = (req, res) => {
    const {title, caption} = req.body;
    if (!title || !caption) return res.status(400).json({message:`Invalid input`});
    const photo_url = `${req.get('host')}/uploads/photos/${req.file.filename}`
    
    
    const {id} = jwt.verify(req.header('authorization').split(' ')[1], process.env.SECRET_TOKEN);

    db.query(`INSERT INTO photos (title, caption, photo_url, user_id)
        VALUES ("${title}", "${caption}", "${photo_url}", "${id}")`
        , (err, result) => {
            if (err) {
                res.status(400).json({
                    message: `Error uploading photo`
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

//function delete photo
const deletePhoto = (req, res) => {
    const id = req.params.id
    const user = jwt.verify(req.header('authorization').split(' ')[1], process.env.SECRET_TOKEN);
    const user_id = user.id

    db.query(`DELETE FROM comments WHERE photo_id = "${id}"`, (err, result) => {
        if (err) throw err
    })

    db.query(`DELETE FROM photos WHERE id = "${id}" AND user_id = "${user_id}"`, (err, result) => {
        if (err) {
            res.status(400).json({
                message: `Please input id correctly`
            })
        }

        res.status(200).json({
            message: `Photo deleted successfully`
        })
    })

}

module.exports = {getAllPhotos, getAllPhotosByUserId, postPhoto, deletePhoto}