const serverless = require("serverless-http");
const express = require("express");
const app = express();
const router = require('./routes/routes');

app.use('/core/facedetection' ,router);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
