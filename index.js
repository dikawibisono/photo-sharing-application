const express = require('express');

const users = require('./routes/users')

const app = express();
const PORT = 3000

app.get('/', (req, res) => {
    res.send({
        message: `Welcome to Photo Sharing Application`
    })
})

app.use('/users', users)

app.listen(PORT, () => {
    console.log('listening on port ' + PORT)
})