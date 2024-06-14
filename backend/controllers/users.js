const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const isAuthenticated = require('../utils/auth');

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('recipes', {name: 1, public: 1})
    response.json(users)
})

usersRouter.get('/name',isAuthenticated, async (request, response) => {
    const userId = request.user.id;
    const name = await User.findById(userId)
    response.json(name.username)
});

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter