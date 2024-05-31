const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper')
const app = require('../app');
const api = supertest(app);

const Recipe = require('../models/recipe');


// Clear the database and add initial recipes before each test
beforeEach(async () => {
  await Recipe.deleteMany({})
  await Recipe.insertMany(helper.initialRecipes)
})


describe('When there is initially some recipes saved', () => {
  // Recipes are returned as JSON
  test('Recipes are returned as json', async () => {
    await api
      .get('/api/recipes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  // All recipes are returned
  test('All recipes can be fetched', async () => {
    const response = await helper.recipesInDb()
    expect(response).toHaveLength(helper.initialRecipes.length)
  })

})

describe('Viewing of specific recipe.', () => {
  test('Succeeds with a valid id.', async () => {
    const recipes = await helper.recipesInDb()
    const recipeToView = recipes[0]

    const resultRecipe = await api
      .get(`/api/recipes/${recipeToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(resultRecipe.body).toEqual(recipeToView)
  })

  test('Fails with statuscode 404 if recipe does not exist.', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api
      .get(`/api/recipes/${validNonexistingId}`)
      .expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '6a3d6da78079881a82d3466'; 
  
    const response = await api
      .get(`/api/recipes/${invalidId}`)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  
    expect(response.body.error).toBe('Invalid ID format');
  });
})


describe('Addition of a new recipe', () => {
  test('Succeeds with a valid data.', async () => {
    const newRecipe = {
      name: 'Muffinssi',
      ingredients: 'jtn, jtn',
      steps: '1. sekoita, 2. paista',
      public: false
    };

    await api
      .post('/api/recipes')
      .send(newRecipe)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await helper.recipesInDb();
    expect(response).toHaveLength(helper.initialRecipes.length + 1);

    const names = response.map(r => r.name);
    expect(names).toContain('Muffinssi');
  });

  test('Fails with statuscode 400 if data is invalid.', async () => {
    const newRecipe = {
      name: 'Virheellinen',
      public: false
    }

    await api
      .post('/api/recipes')
      .send(newRecipe)
      .expect(400)

    const response = await helper.recipesInDb()
    expect(response).toHaveLength(helper.initialRecipes.length)
  })
})


describe('Handling of recipe update', () => {
  test('Recipe can be updated', async () => {
    const recipesAtStart = await helper.recipesInDb();
    const recipeToUpdate = recipesAtStart[0];

    const modifiedRecipe = {
      name: 'Updated Kakku',
      ingredients: 'maito\nvehnäjauhoja\nsokeria\nkananmuna',
      steps: '1. sekoita\n2. paista',
      public: true
    };

    await api
      .put(`/api/recipes/${recipeToUpdate.id}`)
      .send(modifiedRecipe)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const recipesAtEnd = await helper.recipesInDb();
    const updatedRecipe = recipesAtEnd.find(r => r.id === recipeToUpdate.id);

    expect(updatedRecipe.name).toBe(modifiedRecipe.name);
    expect(updatedRecipe.ingredients).toBe(modifiedRecipe.ingredients);
    expect(updatedRecipe.steps).toBe(modifiedRecipe.steps);
    expect(updatedRecipe.public).toBe(modifiedRecipe.public);
  });
})


describe('Deletion of recipe.', () => {
  test('Recipe can be deleted', async () => {
    const recipes = await helper.recipesInDb()
    const recipeToDelete = recipes[0]

    await api
      .delete(`/api/recipes/${recipeToDelete.id}`)
      .expect(204)

    const response = await helper.recipesInDb()
    expect(response).toHaveLength(helper.initialRecipes.length - 1)
  })
})


// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
