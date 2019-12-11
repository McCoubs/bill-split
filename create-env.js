const fs = require('fs');
const crypto = require('crypto');

const token = crypto.randomBytes(64).toString('hex');
fs.writeFileSync('./.env', `JWT_SECRET=${token}\nMONGODB_URL=${process.env.MONGODB_URL}\n
                                        JWT_EXP=1800\nSENDGRID_API_KEY=${process.env.SENDGRID_API_KEY}`);
