'use strict';
// import required libraries
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
require('dotenv').config();

// express setup
const app = express();
let router = express.Router();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: '*' }));

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// auth helper
function validateGoogleAuth(req, res, next) {
  const idToken = req.cookies['googleId'];
  // check token exists
  if (!idToken) {
    res.status(401).send('No google idToken was found');
  } else {
    // if token is valid, move through, else return
    client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID})
      .then((ticket) => next())
      .catch(() => res.status(401).send('Provided idToken was invalid'));
  }
}

// auth routes
router.post('/google-auth-login', (req, res) => {
  const idToken = req.body.idToken;
  if (!!idToken) {
    client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    }).then((ticket) => {
      // set cookie for session management
      res.cookie('googleId', idToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: true });
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
  res.clearCookie('googleId');
  res.status(200).send('Successfully logged out');
});

// email logic
router.post('/send-reminder', validateGoogleAuth, (req, res) => {
  // retrieve info from body of req
  const { type, target, text } = req.body;
  // create a transporter to send info
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD
    }
  });
  const mailOptions = {
    from: 'Bill-Split <bill-split@do-not-reply.com>',
    to: target,
    subject: 'Your split from bill-split.spencermccoubrey.com!',
    text: text
  };
  // send email, listen to response
  transporter.sendMail(mailOptions, (err, info) => {
    console.log(process.env.GMAIL_USERNAME, process.env.GMAIL_PASSWORD, JSON.stringify(err), JSON.stringify(info));
    if (!!err) {
      res.status(500).send('An error occurred while trying to send an email to: ' + target);
    } else {
      res.status(200).json({ message: 'Successfully sent email to: ' + target });
    }
  });
});

// set app options
app.use('/.netlify/functions/server', router);  // path must route to lambda

// export as required by netlify
module.exports = app;
module.exports.handler = serverless(app);
