const express = require('express');
const mongoose = require('mongoose');
const { errorHandler } = require('./utils/errors');
const usersRouter = require('./routes/users');
const itemsRouter = require('./routes/clothingItems');
const { NOT_FOUND_ERROR_CODE } = require('./utils/errors');

const app = express();
const { PORT = 5000, MONGODB_URI = 'mongodb://localhost:27017/wtwr_db' } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '68e12b5092c0df7e58d26e74'
  };
  next();
});

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.json({ 
    message: 'WTWR API is running',
    endpoints: {
      users: '/users',
      items: '/items'
    }
  });
});

app.use('/users', usersRouter);
app.use('/items', itemsRouter);

// 404 for any unmatched route
app.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).json({ message: 'Resource not found' });
});

// centralized error handler
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
