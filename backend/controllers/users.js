const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const usersRouter = require('express').Router()
const User = require('../models/user')
const isAuthenticated = require('../utils/auth');
const passwordValidator = require('../utils/passwordValidator');

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('recipes', { name: 1, public: 1 })
    response.json(users)
})

usersRouter.get('/name', isAuthenticated, async (request, response) => {
    const userId = request.user.id;
    const name = await User.findById(userId)
    response.json(name.username)
});

usersRouter.get('/:id', async (request, response) => {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).json({ error: 'Invalid ID format' });
    }

    const user = await User.findById(id);
    if (user) {
        response.json(user);
    } else {
        response.status(404).json({ error: 'Recipe not found' });
    }
});

usersRouter.get('/check-username/:username', async (req, res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    res.json({ isUnique: !user });
});

usersRouter.post('/', passwordValidator, async (request, response) => {
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