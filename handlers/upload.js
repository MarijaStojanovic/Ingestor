'use strict';

const uploadFileToFileSystem = require('../helpers/upload-file');
const xlsx = require('xlsx');
const path = require('path');
const os = require('os');

function uploadHandler(req, res, db, uploadFile = uploadFileToFileSystem) {
  return new Promise((resolve, reject) => {
    uploadFile(req, res, (err) => {

      if (err === 'InvalidFileType') {
        return reject({
          type: 'InvalidFileType',
          message: 'Please provide XLSX or XLS file'
        });
      }

      if (err) {
        return reject({ err: err.message });
      }

      const { filename } = req.file;
      const clients = [];

      const uploadDir = path.join(os.tmpdir(), 'ingestor/uploads');

      const workbook = xlsx.readFile(path.join(uploadDir, filename));
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames], { header: 1 })
      data.forEach(([clientName, clientId, inputData, amount, fileMetaDataId, fileName, dataToSplit]) => {
        const [source, provider] = dataToSplit.split(':');
        clients.push({
          clientName,
          clientId,
          inputData,
          amount,
          fileMetaDataId,
          fileName,
          source,
          provider
        });
      })

      db.collection('client').insertMany(clients);

      resolve({
        message: 'File is successfuly uploaded',
        path: req.file.path,
        name: req.file.filename
      });
    });
  })
}

module.exports = uploadHandler;
