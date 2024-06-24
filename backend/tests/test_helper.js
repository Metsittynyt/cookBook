const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('../app');
const Recipe = require('../models/recipe');
const User = require('../models/user');

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

const nonExistingId = async () => {
  const recipe = new Recipe({ name: 'Viallinen' });
  await recipe.save();
  await recipe.deleteOne();

  return recipe._id.toString();
};

const recipesInDb = async () => {
  const recipes = await Recipe.find({});
  return recipes.map(recipe => recipe.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map(u => u.toJSON());
};

const clearUsers = async () => {
  await User.deleteMany({});
};

const createInitialUser = async () => {
  const passwordHash = await bcrypt.hash('superSecretPassword', 10);
  const user = new User({ username: 'mrTest', passwordHash });
  await user.save();
};

const loginAndGetCookie = async () => {
  const userCredentials = { username: 'mrTest', password: 'superSecretPassword' };
  const response = await supertest(app)
    .post('/api/login')
    .send(userCredentials);

  return response.headers['set-cookie'][0];
};

module.exports = {
  initialRecipes,
  nonExistingId,
  recipesInDb,
  usersInDb,
  clearUsers,
  createInitialUser,
  loginAndGetCookie,
};
