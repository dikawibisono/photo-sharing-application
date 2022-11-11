const mysql = require('mysql2');

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'photo_sharing_application'
// })


const db = mysql.createConnection(process.env.DATABASE_URL)



module.exports = db