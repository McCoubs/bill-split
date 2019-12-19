const { OAuth2Client } = require('google-auth-library');
const Friend = require('../models/friend');
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
        res.cookie('googleId', idToken, { httpOnly: true, secure: true, sameSite: true });
        console.log(ticket.getPayload());
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

  router.get('/test', (req, res) => {
    client.verifyIdToken({
      idToken: "eyJhbGciOiJSUzI1NiIsImtpZCI6IjIwMTEwOTFkYTAzYmFhNDA5MTllNmZmODM2YzhlN2Y5YWZhYmE5YTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMTA0NjExNDY0MDQzNC0xa25wYjVudjIwZ2pwZzA0MzZpNGNydmtyZTlyMTVjYS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjEwNDYxMTQ2NDA0MzQtMWtucGI1bnYyMGdqcGcwNDM2aTRjcnZrcmU5cjE1Y2EuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQ5NTcxMjk4Mjc0NjIzNjM3MjEiLCJlbWFpbCI6InNwZW5jZW1jY0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Imo1XzBjYTFSRllWeVkwZjZfZ2t1c1EiLCJuYW1lIjoiU3BlbmNlciBNY0NvdWJyZXkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDYuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy11YnhPaDRMaFo1VS9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ0hpM3Jmak5VMDhoaXRxOHJyQXAxZGhGam5teDRBdzRBL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJTcGVuY2VyIiwiZmFtaWx5X25hbWUiOiJNY0NvdWJyZXkiLCJsb2NhbGUiOiJlbiIsImlhdCI6MTU3NjcyOTE1NywiZXhwIjoxNTc2NzMyNzU3LCJqdGkiOiIzOWIxZTMyOTE5MTc0MzhmMzZiOWI3NDE5MGZiNWRmY2VhYjZiZTZkIn0.DUs9VGDuRZtEQzIxpIeOppJnwTXhFeRbtxW29hIODQnCvAElSNpcdbnvra_qEesoIhXlQsbN3VzchRUvVO3HkVakSwPk2Yxg4NhhFmA5OYjfq0z5sngeO_Q6oNcRiwYaeBKga2iLKegUic5E_Eo_H4iI5FUaOi35cFQSdg64t_XT6_ieXYvVpKPsc35n9v4DnkMh0FciHcPn5xPJ2qy6O7XzSWs2H6HmT51gRgu6aZBo8VhAOuz3TNEiC1dHJTy3Xg-Z8dVmyi4OD7wm7YbllnJa793ukL__m4p-vrCpHyaCVp5duKQDU6M-EmcpYdBwEw0v5ge-gmYaWZmR4sO2zg",
      audience: process.env.GOOGLE_CLIENT_ID
    }).then((ticket) => {
      Friend.add(ticket.getPayload()['sub'], 'Spencer', 'spencemcc@gmail.com', '647-982-8401').then((friend) => res.json({
        google: ticket.getPayload(),
        friend: friend
      }))
    }).catch(() => {
      res.status(401).send('Provided idToken was invalid');
    });
  });

  return router;
}

export function authProtect() {
  return true;
}
