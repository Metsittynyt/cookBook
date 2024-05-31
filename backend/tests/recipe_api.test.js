const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper')
const app = require('../app');
const api = supertest(app);

const Recipe = require('../models/recipe');


// Clear the database and add initial recipes before each test
beforeEach(async () => {
  await Recipe.deleteMany({})

  let recipeObject = new Recipe(helper.initialRecipes[0])
  await recipeObject.save()

  recipeObject = new Recipe(helper.initialRecipes[1])
  await recipeObject.save()
})


// Test to check if recipes are returned as JSON
test('Recipes are returned as json', async () => {
  await api
    .get('/api/recipes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});


// All recipes can be fetced
test('All recipes can be fetched', async () => {
  await api
    .get('/api/recipes')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const response = await helper.recipesInDb()
  expect(response).toHaveLength(2)
})


// Specific recipe can be viewed
test('Specific recipe can be viewed', async () => {
  const recipes = await helper.recipesInDb()
  const recipeToView = recipes[0]

  const resultRecipe = await api
    .get(`/api/recipes/${recipeToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultRecipe.body).toEqual(recipeToView)
})


// Test to check if a valid recipe can be added
test('A valid recipe can be added', async () => {
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


// Test to check that invalid recipe cannot be added
test('Empty recipe cant be added', async () => {
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


// Recipe can be updated
test('Recipe can be updated', async () => {
  // Get all recipes from the database
  const recipesAtStart = await helper.recipesInDb();
  const recipeToUpdate = recipesAtStart[0];

  // New data to update the recipe
  const modifiedRecipe = {
    name: 'Updated Kakku',
    ingredients: 'maito\nvehnäjauhoja\nsokeria\nkananmuna',
    steps: '1. sekoita\n2. paista',
    public: true
  };

  // Make the PUT request to update the recipe
  await api
    .put(`/api/recipes/${recipeToUpdate.id}`)
    .send(modifiedRecipe)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  // Get all recipes from the database after the update
  const recipesAtEnd = await helper.recipesInDb();
  const updatedRecipe = recipesAtEnd.find(r => r.id === recipeToUpdate.id);

  // Verify the update
  expect(updatedRecipe.name).toBe(modifiedRecipe.name);
  expect(updatedRecipe.ingredients).toBe(modifiedRecipe.ingredients);
  expect(updatedRecipe.steps).toBe(modifiedRecipe.steps);
  expect(updatedRecipe.public).toBe(modifiedRecipe.public);
});

// Recipe can be deleted
test('Recipe can be deleted', async () => {
  const recipes = await helper.recipesInDb()
  const recipeToDelete = recipes[0]

  await api
    .delete(`/api/recipes/${recipeToDelete.id}`)
    .expect(204)

  const response = await helper.recipesInDb()
  expect(response).toHaveLength(helper.initialRecipes.length - 1)
})

// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
