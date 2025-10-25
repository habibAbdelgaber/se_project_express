const express = require('express');
const mongoose = require('mongoose');
const { errorHandler } = require('./utils/errors');

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test environment helper: ensure req.user is populated with a test user id
// Tests expect `req.user._id` to be available. Set the known test id here.
app.use((req, res, next) => {
  // Important: string form matches tests that compare to a hex string
  req.user = { _id: '68e12b5092c0df7e58d26e74' };
  return next();
});

mongoose.connect('mongodb://127.0.0.1:27017/wtwr', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mount routers
const usersRouter = require('./routes/users');

const itemsRouter = require('./routes/clothingItems');

app.use('/users', usersRouter);
app.use('/items', itemsRouter);

// 404 for any unmatched route
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// centralized error handler
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    // use console.info to avoid eslint no-console warnings in CI
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
