const multer = require('multer')
const {v4} = require('uuid')
const path = require('path')
const fs = require('fs')
const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,`${__dirname}/../../uploads`)
    },
    filename:(req,file,cb)=>{
        const mimetype =  file.mimetype;
        let ext = mimetype.split('/')[1]
        let filename = `${v4()}.${ext}`
        cb(null,filename)
    }

})

const upload = multer({storage:storage})

module.exports = upload