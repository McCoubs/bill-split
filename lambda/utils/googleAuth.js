const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export function authRoutes(router) {
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

  return router;
}

export function authProtect() {
  return true;
}
