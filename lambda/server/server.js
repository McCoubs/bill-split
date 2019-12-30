'use strict';
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');

let router = express.Router();

router.post('/google-auth-login', (req, res) => {
  const idToken = req.body.idToken;
  if (!!idToken) {
    client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    }).then((ticket) => {
      // set cookie for session management
      res.cookie('googleId', idToken, { httpOnly: true, secure: true /* process.env.NODE_ENV === 'production' */, sameSite: true });
      // send back payload
      res.json(ticket.getPayload());
    }).catch(() => {
      res.status(401).send('Provided idToken was invalid');
    });
  } else {
    res.status(401).send('No idToken was provided');
  }
});

router.post('/google-auth-logout', (req, res) => {

});

// router = authRoutes(router);

app.use(cors({credentials: true, origin: '*'}));
app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda

module.exports = app;
module.exports.handler = serverless(app);
