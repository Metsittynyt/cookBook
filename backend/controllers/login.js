const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

// Log in
loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username });
  const passwordCorrect = user !== null && await bcrypt.compare(password, user.passwordHash);

  if (!user || !passwordCorrect) {
    return response.status(401).json({
      error: 'Invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '24h' });

  response.cookie('auth_token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  response.status(200).send({ username: user.username, name: user.name });
});

// Log out
loginRouter.get('/', (request, response) => {
  request.session.destroy(error => {
    if (error) {
      return response.status(500).send('Failed to log out.');
    }

    response.clearCookie('auth_token');
    response.send('Logged out successfully.');
  });
});

module.exports = loginRouter