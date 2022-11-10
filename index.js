const express = require('express');

const users = require('./routes/users');
const photos = require('./routes/photos');
const comments = require('./routes/comments');

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send({
        message: `Welcome to Photo Sharing Application`
    })
})

app.use('/users', users)

app.use('/photos', photos)

app.use('/uploads/photos', express.static('uploads/photos'))

app.use('/comments', comments)

app.listen(port, () => {
    console.log('listening on port ' + port)
})