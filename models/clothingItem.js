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

// Define clothing item schema
const ClothingItemSchema = new Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  weather: { type: String, required: true, enum: ['hot', 'warm', 'cold'] },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  // 1) & 2) refs should point to 'user'
  owner: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'user', default: [] }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 3) Model names must be 'user' and 'clothingItem'
const User = mongoose.model('user', UserSchema);
const ClothingItem = mongoose.model('clothingItem', ClothingItemSchema);

module.exports = { User, ClothingItem };
