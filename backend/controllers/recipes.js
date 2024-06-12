const recipesRouter = require('express').Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Recipe = require('../models/recipe');
const User = require('../models/user');
const isAuthenticated = require('../utils/auth');
const { request, response } = require('express');
const recipe = require('../models/recipe');

// Get recipes (all or user-specific based on query parameter)
recipesRouter.get('/', isAuthenticated, async (request, response) => {
    const { myRecipes, excludeMyRecipes, mySavedRecipes } = request.query;
    const userId = request.user.id;

    let query = {};
    if (myRecipes === 'true') {
        query.user = userId;
    } else if (excludeMyRecipes === 'true') {
        query.user = { $ne: userId };
    } else if (mySavedRecipes === 'true') {
        query.savedBy = userId;
    }

    const recipes = await Recipe.find(query).populate('user', { username: 1, name: 1 });
    response.json(recipes);
});

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

// check toggle status
recipesRouter.get('/:id/toggleStatus', isAuthenticated, async (request, response) => {
    const { id } = request.params;
    const action = request.query.action;
    const userId = request.user.id;

    const recipe = await Recipe.findById(id);
    if (!recipe) {
        return response.status(404).json({ error: 'Recipe not found' });
    }

    if (action === 'like') {
        const hasLiked = recipe.likedBy.includes(userId);
        response.json({ isLiked: hasLiked });
    } else if (action === 'save') {
        const hasSaved = recipe.savedBy.includes(userId);
        response.json({ isSaved: hasSaved });
    }
});

// Add new recipe
recipesRouter.post('/', isAuthenticated, async (request, response) => {
    const body = request.body;
    const user = await User.findById(request.user.id);

    if (!body.name || !body.ingredients || !body.steps) {
        return response.status(400).json('Invalid data');
    }

    const recipe = new Recipe({
        name: body.name,
        ingredients: body.ingredients,
        steps: body.steps,
        time: body.time,
        difficulty: body.difficulty,
        tags: body.tags || [],
        public: body.public || false,
        likes: body.likes || 0,
        user: user._id
    })

    const newRecipe = await recipe.save()
    user.recipes = user.recipes.concat(newRecipe._id)
    await user.save()

    response.status(201).json(newRecipe)
})

// Update recipe by id
recipesRouter.put('/:id', isAuthenticated, async (request, response) => {
    const { id } = request.params;
    const body = request.body;
    const userId = request.user.id;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
        return response.status(404).send('Recipe not found');
    }

    const hasLiked = recipe.likedBy.includes(userId);

    // Handle the like functionality
    if (body.likeToggle) {
        if (hasLiked) {
            recipe.likedBy.pull(userId);
            recipe.likes = recipe.likes > 0 ? recipe.likes - 1 : 0;
        } else {
            recipe.likedBy.push(userId);
            recipe.likes += 1;
        }
    }

    if (body.saveToggle) {
        const hasSaved = recipe.savedBy.includes(userId);
        if (hasSaved) {
            recipe.savedBy.pull(userId);
        } else {
            recipe.savedBy.push(userId);
        }
    }

    const updateData = {
        name: body.name || recipe.name,
        ingredients: body.ingredients || recipe.ingredients,
        steps: body.steps || recipe.steps,
        time: body.time || recipe.time,
        difficulty: body.difficulty || recipe.difficulty,
        tags: body.tags || recipe.tags,
        public: body.public !== undefined ? body.public : recipe.public,
        likes: recipe.likes,
        likedBy: recipe.likedBy,
        savedBy: recipe.savedBy
    };

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updateData, { new: true });
    response.json(updatedRecipe);
});

// Delete recipe by id
recipesRouter.delete('/:id', isAuthenticated, async (request, response) => {
    await Recipe.findByIdAndDelete(request.params.id);
    response.status(204).end();
});

module.exports = recipesRouter;
