const fs = require('fs');
const crypto = require('crypto');

const token = crypto.randomBytes(64).toString('hex');
console.log(`JWT_SECRET=${token}\nMONGODB_URL=${process.env.MONGODB_URL}\nJWT_EXP=1800`);
fs.writeFileSync('./.env', `JWT_SECRET=${token}\nMONGODB_URL=${process.env.MONGODB_URL}\nJWT_EXP=1800`);
