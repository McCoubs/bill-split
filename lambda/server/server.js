'use strict';
// import required libraries
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { OAuth2Client } = require('google-auth-library');
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');
require('dotenv').config();

// express setup
const app = express();
let router = express.Router();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: '*' }));

// config using env keys
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// auth helper
function validateGoogleAuth(req, res, next) {
  const idToken = req.cookies['googleId'];
  // check token exists
  if (!idToken) {
    res.status(401).send('No google idToken was found');
  } else {
    // if token is valid, move through, else return
    oAuth2Client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID})
      .then((ticket) => next())
      .catch(() => res.status(401).send('Provided idToken was invalid'));
  }
}

// auth routes
router.post('/google-auth-login', (req, res) => {
  const idToken = req.body.idToken;
  if (!!idToken) {
    oAuth2Client.verifyIdToken({
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
  res.status(200).json({ message: 'Successfully logged out' });
});

// email logic
router.post('/send-reminder', (req, res) => {
  // retrieve info from body of req
  const { type, target, text } = req.body;

  let result;
  switch (type) {
    case 'email':
      const mailOptions = {
        from: 'Bill-Split <bill-split@do-not-reply.com>',
        to: target,
        subject: 'Your split from bill-split.spencermccoubrey.com! (Do Not Reply)',
        text: text
      };
      // send email using sendGrid API
      result = sgMail.send(mailOptions);
      break;
    case 'sms':
      // send sms using twilio API
      result = twilioClient.messages.create({ body: text, from: '+13658045237', to: target });
      break;
    default:
      return res.status(400).send('Reminder type: ' + type + ' is unsupported');
  }
  // handle error and success responses, returning correct info to caller
  result
    .then(() => res.status(200).json({ message: 'Successfully sent an ' + type + ' to: ' + target }))
    .catch(() => res.status(500).send('An error occurred while trying to send an ' + type + ' to: ' + target));
});

// set app options
app.use('/.netlify/functions/server', router);  // path must route to lambda

// export as required by netlify
module.exports = app;
module.exports.handler = serverless(app);
