"use strict";

var _fileUploadService = require("../services/fileUploadService");
var express = require('express');
var fileImportAPIRouter = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + '.csv');
  }
});
var upload = multer({
  storage: storage
});
fileImportAPIRouter.post('/upload', upload.single('file'), function (req, res) {
  console.log('api');
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }
  var file = req.file;
  (0, _fileUploadService.uploadFile)(file);
  res.sendStatus(200);
});
module.exports = fileImportAPIRouter;
//# sourceMappingURL=fileUploadRouter.js.map