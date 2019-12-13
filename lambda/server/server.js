'use strict';
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();
router.get('/', (req, res) => {
  res.write('<h1>'+ process.env.MONGODB_URL + process.env.JWT_SECRET + process.env.JWT_EXP + '</h1>');
  res.write('<h1>Hello from Express.js!</h1><p>'+ jwt.sign({ sub: 'hello' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  }) + '</p>');
  res.end();
});

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
