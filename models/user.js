const mongoose = require('mongoose');
const validator = require('validator');

// Initialize schema
const { Schema } = mongoose;

// Define user schema
const UserSchema = new Schema({
  name: { type: String, required: true, unique: true, minlength: 2, maxlength: 30 },
  about: { type: String, maxlength: 200, default: '' },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
});

// Create and export user model
const User = mongoose.model('user', UserSchema);

module.exports = { User };
