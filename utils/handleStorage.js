const multer = require('multer')

const storage = multer.diskStorage({
    destination:function(req, file, callback){ // pasan argumentos automaticamente
        const pathStorage = __dirname+"/../static"
        callback(null, pathStorage) // error y destination
    },
    filename:function(req, file, callback){ // sobreescribimos o renombramos
        //tienen extension jpg, pdf, mp4
        const user = req.user;
        const fileArr = file.originalname.split(".") //el ultimo valor
        const filename = "logo-"+user._id.toString()+"-"+Date.now()+"."+fileArr[1]
        callback(null, filename)
    }
})

const uploadMiddleware = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5 
    }
});

const fs = require('fs'); // Import the fs module

const deleteFile = (filename) => {
    fs.unlink(`${__dirname}/../static/${filename}`, (err) => {
        if (err) throw err;
    });
}

module.exports = { uploadMiddleware, deleteFile }