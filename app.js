const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errorHandler } = require('./utils/errors');
const routes = require('./routes');

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

app.use(routes);

app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
