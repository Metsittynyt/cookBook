const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express()
const cors = require('cors')
const path = require('path');

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto', httpOnly: true }
}));

const recipesRouter = require('./controllers/recipes')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [process.env.DEV_ORIGIN, process.env.PROD_ORIGIN];
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.static('dist'))
app.use(express.json())
app.use(cookieParser());
app.use(middleware.requestLogger)

app.use('/api/recipes', recipesRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

// SPA Fallback: Serve index.html for all non-API routes
app.get('*', (request, response) => {
  response.sendFile(path.resolve('dist', 'index.html'));
});

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: function (res, path) {
    if (path.endsWith('.woff2')) {
      res.set('Content-Type', 'font/woff2');
    }
  }
}));

module.exports = app