const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Recipe = require('../models/recipe')

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
]

beforeEach(async () => {
  await Recipe.deleteMany({})
  let recipeObject = new Recipe(initialRecipes[0])
  await recipeObject.save()
  recipeObject = new Recipe(initialRecipes[1])
  await recipeObject.save()
})

test('recipes are returned as json', async () => {
  await api
    .get('/api/recipes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(async () => {
  await mongoose.connection.close()
})