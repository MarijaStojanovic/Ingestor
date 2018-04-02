'use strict';

const multer = require('multer');
const path = require('path');
const mkdirp = require('mkdirp');
const os = require('os');

const fileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.mimetype !== 'application/vnd.ms-excel' && file.mimetype !== 'application/octet-stream' && file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        cb('InvalidFileType');
      }
      const uploadDir = path.join(os.tmpdir(), 'ingestor/uploads');
      mkdirp(uploadDir, function (err) {
        if (err) {
          cb(err);
        }
        cb(null, uploadDir);
      })
    }
  }),
  limits: {
    fileSize: 10000000, // 10 Mb
  },
}).single('file');

module.exports = fileUpload;