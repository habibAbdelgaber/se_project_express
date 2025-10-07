const mongoose = require('mongoose');
const validator = require('validator');

// Initialize schema
const schema = mongoose.Schema;

// Define user schema
const userSchema = new schema({
  name: { type: String, required: true, unique: true, minlength: 2, maxlength: 30 },
  about: { type: String, maxlength: 200, default: '' },
  avatar: {
    type: String, required: true, validate: {
      validator(value) {
        return validator.isURL(value);
      }, message: props => `${props.value} is not a valid URL!`
    }
  },
});

// Define clothing item schema
const clothingItemSchema = new schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  weather: { type: String, required: true, enum: ['hot', 'warm', 'cold'] },
  imageUrl: {
    type: String, required: true, validate: {
      validator(value) {
        return validator.isURL(value);
      }, message: props => `${props.value} is not a valid URL!`
    }
  },
  owner: { type: schema.Types.ObjectId, ref: 'users', required: true },
  likes: [{ type: schema.Types.ObjectId, ref: 'users', default: [] }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Export user model
const User = mongoose.model('users', userSchema);

// Export clothing item model
const ClothingItem = mongoose.model('clothingItems', clothingItemSchema);

module.exports = { User, ClothingItem };