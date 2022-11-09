const multer = require('multer')

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'./uploads/photos')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
    ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const uploadFile = multer({storage: fileStorage, fileFilter:fileFilter}).single('photo')


module.exports = uploadFile