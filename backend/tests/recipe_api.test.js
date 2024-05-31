const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Recipe = require('../models/recipe');
const assert = require('assert'); // Import the assert module

const initialRecipes = [
  {
    name: 'Kakku',
    ingredients: 'maito\nvehnäjauhoja\nsokeria',
    steps: 'sekoita\npaista',
    public: false
  },
  {
    name: 'Piirakka',
    ingredients: 'voita\nvehnäjauhoja\nsuolaa',
    steps: 'sekoita\npaista',
    public: true
  }
];

// Clear the database and add initial recipes before each test
beforeEach(async () => {
  await Recipe.deleteMany({});
  await Recipe.insertMany(initialRecipes);
});

// Test to check if recipes are returned as JSON
test('recipes are returned as json', async () => {
  await api
    .get('/api/recipes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

// Test to check if a valid recipe can be added
test('a valid recipe can be added', async () => {
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

  const response = await api.get('/api/recipes');
  const names = response.body.map(r => r.name);

  assert.strictEqual(response.body.length, initialRecipes.length + 1);
  assert(names.includes('Muffinssi'));
});

// Close the database connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
});
