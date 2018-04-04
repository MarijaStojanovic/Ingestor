'use strict';

const path = require('path');
const { escapeRegExp } = require('../helpers/escapeSearch');

async function getClients(req, res, db) {
  const { filterBy, sortBy, skip = 0, direction } = req.query;
  let { limit = 50 } = req.query;

  const requirement = db.collection('requirement');

  const query = {};
  const sort = { createdAt: 1 };

  if (limit > 50) {
    limit = 50;
  }

  if (sortBy) {
    sort[sortBy] = direction || 1;
  }

  if (filterBy) {
    const filteredQuery = escapeRegExp(filterBy);
    query.$or = [
      { provider: new RegExp(filteredQuery, 'i') },
      { fileName: new RegExp(filteredQuery, 'i') },
      { clientName: new RegExp(filteredQuery, 'i') },
    ];
  }

  return await requirement.aggregate([
    {
      $match: query
    },
    {
      $lookup:
        {
          from: 'client',
          localField: 'clientId',
          foreignField: '_id',
          as: 'name'
        }
    },
    {
      $lookup:
        {
          from: 'file',
          localField: 'fileMetaDataId',
          foreignField: 'fileMetaDataId',
          as: 'files'
        }
    },
    {
      $project: {
        _id: '$name._id',
        clientId: 1,
        amount: 1,
        inputData: 1,
        fileMetaDataId: 1,
        fileName: '$files.fileName',
        source: '$files.source',
        provider: '$files.provider',
        clientName: '$name.clientName',
      },
    },
    {
      $sort: sort
    },
    {
      $limit: Number(limit)
    },
    {
      $skip: Number(skip),
    },
  ]).toArray();
}

module.exports = getClients;
