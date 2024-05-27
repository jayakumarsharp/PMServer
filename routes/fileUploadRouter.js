var express = require('express');
import { uploadFile } from '../services/fileUploadService';
var fileImportAPIRouter = express.Router();

const multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.csv') 
  }
})
const upload = multer({ storage: storage });

fileImportAPIRouter.post('/upload', upload.single('file'), function (req, res) {
    console.log('api');
    if (!req.file) {
        return res.status(400).send('No files were uploaded.');
      }

    const file = req.file;
    uploadFile(file);

    res.sendStatus(200);
});

module.exports = fileImportAPIRouter;