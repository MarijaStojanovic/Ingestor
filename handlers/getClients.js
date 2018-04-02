'use strict';

const path = require('path');
const { escapeRegExp } = require('../helpers/escapeSearch');

async function getClients(req, res, db) {
  const { filterBy, sortBy, skip = 0 } = req.query;
  let { limit = 50 } = req.query;

  const client = db.collection('client')
  const query = {};
  const sort = {};

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

  return await client
    .find(query)
    .sort(sort)
    .skip(Number(skip))
    .limit(Number(limit))
    .toArray();
}

module.exports = getClients;
