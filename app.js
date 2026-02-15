const express = require('express');
const mongoose = require('mongoose');
const { errorHandler } = require('./utils/errors');
const { auth } = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const itemsRouter = require('./routes/clothingItems');
const { createUser, login } = require('./controllers/users');
const { NOT_FOUND_ERROR_CODE } = require('./utils/errors');

const app = express();
// const { PORT = 3000, MONGODB_URI = 'mongodb://localhost:27017/wtwr_db' } = process.env;
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.post('/signup', createUser);
app.post('/signin', login);

app.use('/users', auth, usersRouter);
app.use('/items', itemsRouter);

app.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).json({ message: 'Resource not found' });
});

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
