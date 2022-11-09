const db = require('../database/dbConnection');
const jwt = require('jsonwebtoken');

const postComment = (req, res) => {
    const {photo_id, comment} = req.body

    if(!photo_id || !comment){return res.status(400).json({message: "Missing input"})}

    const user = jwt.verify(req.header('authorization').split(' ')[1], process.env.SECRET_TOKEN);
    const user_id = user.id
    
    const query = `INSERT INTO comments (comment, photo_id, user_id)
                    VALUES ('${comment}', '${photo_id}', '${user_id}')`;

    db.query(query, (err) => {
        
        if (err) {
            res.status(400).json({
                message: `Please input correctly`
            })
        }

        res.status(201).json({
            message: `Comment post successfully`
        })
    })
}

const getComments = (req, res) => {
    const user = jwt.verify(req.header('authorization').split(' ')[1], process.env.SECRET_TOKEN);
    const user_id = user.id

    query = `SELECT * FROM comments WHERE user_id = ${user_id}`
    db.query(query, (err, result) => {
        res.status(200).json({
            message: `Your comment activity`,
            data: result
        })
    })
}

const deleteComment = (req, res) => {
    const id = req.params.id

    const user = jwt.verify(req.header('authorization').split(' ')[1], process.env.SECRET_TOKEN);
    const user_id = user.id

    query = `DELETE FROM comments WHERE id = ${id} and user_id = ${user_id}`
    db.query(query, (err) => {
        if (err) {
            res.status(200).json({
                message: `Cannot delete comment`
            })
        }
        res.status(200).json({
            message: `Comment has been deleted`
        })
    })
}

module.exports = {postComment, getComments, deleteComment}