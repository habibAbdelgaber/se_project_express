const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, login } = require('./controllers/users');
const { validateUserBody, validateLogin } = require('./middlewares/validation');

const app = express();
const { PORT = 5000 } = process.env;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(requestLogger);

app.post('/signup', validateUserBody, createUser);
app.post('/signin', validateLogin, login);

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
