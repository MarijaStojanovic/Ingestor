'use strict';

const path = require('path');

async function getSingleClient(req, res, db) {
  const { clientId } = req.params;

  const client = db.collection('client');
  const requirement = db.collection('requirement');

  const [{ _id, clientName }] = await client.find({ _id: clientId }).toArray();
  if (!_id) {
    throw 'Client not found';
  }
  const [user] = await requirement.aggregate([
    {
      $match: {
        clientId: _id,
      }
    },
    {
      $lookup:
        {
          from: 'file',
          localField: 'fileMetaDataId',
          foreignField: 'fileMetaDataId',
          as: 'fileData'
        }
    },
    {
      $group: {
        _id: '$clientId',
        totalAmount: {
          $sum: '$amount'
        },
        files: {
          $push: '$fileData.fileName'
        },
        count: {
          $sum: 1,
        },
      },
    }
  ]).toArray();
  user.name = clientName;
  return user;
}

module.exports = getSingleClient;
