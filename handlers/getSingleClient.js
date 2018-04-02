'use strict';

const path = require('path');
const ObjectId = require('mongodb').ObjectID;

async function getSingleClient(req, res, db) {
  const { clientId } = req.params;

  const client = db.collection('client');

  const clientUser = await client.find({ _id: new ObjectId(clientId) }).toArray();

  if (!clientUser.length) {
    throw 'Client not found';
  }
  const [user] = await client.aggregate([
    {
      $match: {
        clientId: clientUser[0].clientId,
      }
    },
    {
      $group: {
        _id: '$clientId',
        clients: { $push: '$$ROOT' },
        totalAmount: {
          $sum: '$amount'
        },
        files: {
          $push: '$fileName'
        },
        count: {
          $sum: 1,
        },
      }
    },
  ]).toArray();
  user.name = clientUser[0].clientName;
  return user;

}

module.exports = getSingleClient;
