const jwt = require('jsonwebtoken')
const recipesRouter = require('express').Router()
const mongoose = require('mongoose');
const Recipe = require('../models/recipe')
const User = require('../models/user')


const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

// Get all
recipesRouter.get('/', async (request, response) => {
    const recipes = await Recipe
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(recipes)
})


// Get one by id
recipesRouter.get('/:id', async (request, response) => {
    const { id } = request.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).json({ error: 'Invalid ID format' });
    }

    const recipe = await Recipe.findById(id);
    if (recipe) {
        response.json(recipe);
    } else {
        response.status(404).json({ error: 'Recipe not found' });
    }
});


// Add new recipe
recipesRouter.post('/', async (request, response) => {
    const body = request.body

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!body.name || !body.ingredients || !body.steps) {
        return response.status(400).json('Invalid data')
    }

    const recipe = new Recipe({
        name: body.name,
        ingredients: body.ingredients,
        steps: body.steps,
        public: body.public || false,
        user: user._id
    })

    const newRecipe = await recipe.save()
    user.recipes = user.recipes.concat(newRecipe._id)
    await user.save()

    response.status(201).json(newRecipe)
})


// Update recipe by id
recipesRouter.put('/:id', async (request, response) => {
    const body = request.body;

    const updateData = {
        name: body.name,
        ingredients: body.ingredients,
        steps: body.steps,
        public: body.public || false
    };

    const updatedRecipe = await Recipe.findByIdAndUpdate(request.params.id, updateData, { new: true });

    if (!updatedRecipe) {
        return response.status(404).send('Recipe not found');
    }

    response.json(updatedRecipe);
});

// Delete recipe by id
recipesRouter.delete('/:id', async (request, response) => {
    await Recipe.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

module.exports = recipesRouter