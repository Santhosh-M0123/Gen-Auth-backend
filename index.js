const serverless = require("serverless-http");
const express = require("express");
const app = express();
const genAuthDb = require('./config/db');
const createCollection = require('./helper/Rekognition');


// Example query to check the connection
genAuthDb.raw('SELECT 1+1 AS result')
  .then(() => {
    console.log('Connected to PostgreSQL using Knex.js');
  })
  .catch(err => {
    console.error('Failed to connect to PostgreSQL:', err);
});

app.get('/', async (req,res) => {
  let collectionName = 'gen-auth-face-collection'
  let info = await createCollection(collectionName);
  res.json(info);
})

app.get('/aws/create', async (req,res) => {
  let collectionName = 'gen-auth-face-collection'
  let info = await createCollection(collectionName);
  res.json(info);
})

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
