'use strict';

const express = require('express');
const uploadHandler = require('./handlers/upload');
const getClients = require('./handlers/getClients');
const getSingleClient = require('./handlers/getSingleClient');
const MongoClient = require('mongodb').MongoClient;

const app = express();
let db;

app.use(express.static('public'));
app.use(express.static('views'));

app.post('/api/upload', (req, res) => {
  uploadHandler(req, res, db)
    .then(data => res.json(data))
    .catch(err => {
      res.status(400).json(err)
    });
});

app.get('/api/client', (req, res) => {
  getClients(req, res, db)
    .then(data => res.json(data))
    .catch(err => {
      res.status(400).json(err)
    });
});

app.get('/api/client/:clientId', (req, res) => {
  getSingleClient(req, res, db)
    .then(data => res.json(data))
    .catch(err => {
      res.status(400).json(err)
    });
});

const mongoConnectionUrl = process.env.mongoConnectionUrl || 'mongodb://localhost:27017';
const port = process.env.PORT || 3001;

MongoClient.connect(mongoConnectionUrl, function (err, client) {
  if (err) {
    console.log('Mongo error', err);
  }
  console.log('Connected successfully to server');

  db = client.db('ingestor');

  // If the Node process ends, close the Mongo connection
  process.on('SIGINT', () => {
    client.close();
  })

  app.listen(port);
});
