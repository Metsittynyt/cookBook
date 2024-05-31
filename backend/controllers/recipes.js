const recipesRouter = require('express').Router()
const Recipe = require('../models/recipe')


// Get all
recipesRouter.get('/', (request, response) => {
    Recipe.find({}).then(recipes => {
        response.json(recipes)
    })
})


// Get one by id
recipesRouter.get('/:id', (request, response, next) => {
    Recipe.findById(request.params.id)
        .then(recipe => {
            if (recipe) {
                response.json(recipe)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})


// Add new recipe
recipesRouter.post('/', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.ingredients || !body.steps) {
        return response.status(400).json({
            error: 'something is missing'
        })
    }

    const recipe = new Recipe({
        name: body.name,
        ingredients: body.ingredients,
        steps: body.steps,
        public: body.public || false
    })

    recipe.save()
        .then(savedRecipe => {
            response.status(201).json(savedRecipe)
        })
        .catch(error => next(error))
})

// Update recipe by id
recipesRouter.put('/:id', (request, response, next) => {
    const body = request.body;

    const updateData = {
        name: body.name,
        ingredients: body.ingredients,
        steps: body.steps,
        public: body.public || false
    };

    Recipe.findByIdAndUpdate(request.params.id, updateData, { new: true })
        .then(updatedRecipe => {
            if (!updatedRecipe) {
                return response.status(404).send('Recipe not found');
            }
            response.json(updatedRecipe);
        })
        .catch(error => next(error));
});

// Delete recipe by id
recipesRouter.delete('/:id', (request, response, next) => {
    Recipe.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

module.exports = recipesRouter