const express = require('express');
const mongoose = require('mongoose');
const { errorHandler } = require('./utils/errors');

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/wtwr', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mount routers
const usersRouter = require('./routes/users');

const itemsRouter = require('./routes/clothingItems');
app.use('/users', usersRouter);
app.use('/items', itemsRouter);


app.use((req, res, next) => {
  req.user = {
    _id: '61eade4c6d5acf558c42d9b8'
  };
  next();
});

// 404 for any unmatched route
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// centralized error handler
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
