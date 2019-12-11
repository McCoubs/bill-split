// ─────────────────────────────────────────────────────────────────────────────
// import
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();

const ServerError = require('../utils/ServerError');
const mongoose = require('mongoose');

// ─────────────────────────────────────────────────────────────────────────────
// database
// ─────────────────────────────────────────────────────────────────────────────

// connect to the db
mongoose.connect(
  process.env.MONGODB_URL.toString() || 'mongodb://localhost:27017',
  { useNewUrlParser: true },
);

// ─────────────────────────────────────────────────────────────────────────────
// schema
// ─────────────────────────────────────────────────────────────────────────────

const FriendSchema = new mongoose.Schema(
  {
    creator: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    phone_number: {
      type: String,
      required: false,
      trim: true
    },
  },
  { timestamps: true }, // adds createdAt and updatedAt automatic fields
);

// ─────────────────────────────────────────────────────────────────────────────
// statics
// ─────────────────────────────────────────────────────────────────────────────

FriendSchema.statics.add = async function add(creator, name, email, phone_number) {
  try {
    // check if required data received
    if (!(creator && name && email)) {
      throw new ServerError(400, 'Parameters "creator", "name" and "email" are required');
    }

    // create new friend, will throw with code 11000 if friend already exists
    const friend = await this.create({ creator, name, email, phone_number });

    // all went well, return JWT token
    return friend
  } catch (error) {
    // check if DB-specific error
    if (error.code === 11000) {
      throw new ServerError(500, 'User already exists');
    }

    // pass generic error up
    throw error;
  }
};

FriendSchema.statics.delete = async function deleteAccount(id) {
  try {
    // check if required data received
    if (!id) {
      throw new ServerError(400, 'Parameters "id" are required');
    }

    // search for a user based on id
    // remove user data
    await this.findByIdAndDelete(id);
  } catch (error) {
    // something went bad, pass error up
    throw error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// model
// ─────────────────────────────────────────────────────────────────────────────

// try exporting an already-existing schema first
// this prevents a "Cannot overwrite model once compiled." error
module.exports = mongoose.models.Friend || mongoose.model('Friend', FriendSchema);
