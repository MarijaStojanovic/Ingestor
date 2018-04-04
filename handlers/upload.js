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
      const requirements = [];
      const fileMetaData = [];
      const clients = [];

      const uploadDir = path.join(os.tmpdir(), 'ingestor/uploads');

      const workbook = xlsx.readFile(path.join(uploadDir, filename));
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames], { header: 1 })
      data.forEach(([clientName, clientId, inputData, amount, fileMetaDataId, fileName, dataToSplit]) => {
        const [source, provider] = dataToSplit.split(':');
        const [, amountNumber] = amount.split('$');
        const amountToSave = Number(amountNumber.replace(',', ''))

        clients.push({
          clientId,
          clientName,
        });
        requirements.push({
          clientId,
          inputData,
          fileMetaDataId,
          amount: amountToSave,
        });
        fileMetaData.push({
          fileMetaDataId,
          fileName,
          source,
          provider
        });
      })

      Promise.all([
        clients.map(client => { db.collection('client').update({ _id: client.clientId }, { $set: { clientName: client.clientName } }, { upsert: true }) }),
        db.collection('requirement').insertMany(requirements),
        db.collection('file').insertMany(fileMetaData),
        db.collection('file').createIndex({ fileMetaDataId: 1 }),
        db.collection('requirement').createIndex({ clientId: 1 })
      ])

      resolve({
        message: 'File is successfuly uploaded',
        path: req.file.path,
        name: req.file.filename
      });
    });
  })
}

module.exports = uploadHandler;
