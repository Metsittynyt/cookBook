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
];

const nonExistingId = async () => {
  const recipe = new Recipe({ name: 'Viallinen' })
  await recipe.save()
  await recipe.deleteOne()

  return recipe._id.toString()
}

const recipesInDb = async () => {
  const recipes = await Recipe.find({})
  return recipes.map(recipe => recipe.toJSON())
}

module.exports = {
  initialRecipes, nonExistingId, recipesInDb
}