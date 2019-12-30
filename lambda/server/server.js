'use strict';
// import required libraries
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { authRoutes } = require('../utils/googleAuth');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');

let router = express.Router();
router = authRoutes(router);

app.use(cors({credentials: true, origin: '*'}));
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
