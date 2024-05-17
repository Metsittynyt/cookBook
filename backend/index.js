require('dotenv').config()
const express = require('express')
const app = express()
const Recipe = require('./models/recipe')
const cors = require('cors')
const mongoose = require('mongoose');


app.use(cors())
app.use(express.json());
app.use(express.static('dist'))


const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}


app.use(requestLogger)


app.get('/api/recipes', (request, response) => {
    Recipe.find({}).then(recipes => {
        response.json(recipes)
    })
})

app.get('/api/recipes/:id', (request, response) => {
    const id = request.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).json({ error: 'Invalid ID format' });
    }

    Recipe.findById(id)
        .then(recipe => {
            if (recipe) {
                response.json(recipe);
            } else {
                response.status(404).json({ error: 'Recipe not found' });
            }
        })
        .catch(error => {
            response.status(500).json({ error: 'Internal Server Error' });
        });
});

app.post('/api/recipes', (request, response) => {
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

    recipe.save().then(savedRecipe => {
        response.json(savedRecipe)
    })
})

app.put('/api/recipes/:id', (request, response) => {
    const id = request.params.id;
    const body = request.body;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return response.status(400).json({ error: 'Invalid ID format' });
    }

    const updatedRecipeData = {
        name: body.name,
        ingredients: body.ingredients,
        steps: body.steps,
        public: body.public,
    };

    Recipe.findByIdAndUpdate(id, updatedRecipeData, { new: true })
        .then(updatedRecipe => {
            if (!updatedRecipe) {
                return response.status(404).json({ error: 'Recipe not found' });
            }
            response.json({
                message: 'Recipe updated successfully',
                recipe: updatedRecipe,
            });
        })
        .catch(error => {
            console.error('Error updating recipe:', error);
            response.status(500).json({ error: 'Internal Server Error' });
        });
});


app.delete('/api/recipes/:id', (request, response) => {
    const id = request.params.id;

    Recipe.findByIdAndDelete(id)
        .then(deletedRecipe => {
            if (!deletedRecipe) {
                return response.status(404).json({ error: 'Recipe not found' });
            }
            response.status(204).end();
        })
        .catch(error => {
            response.status(500).json({ error: 'Internal Server Error' });
        });
})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})