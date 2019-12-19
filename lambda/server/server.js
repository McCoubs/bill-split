'use strict';
const express = require('express');
const serverless = require('serverless-http');
const { authRoutes } = require('../utils/googleAuth');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');

let router = express.Router();
router = authRoutes(router);

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
