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

const recipesInDb = async () => {
  const recipes = await Recipe.find({})
  return recipes.map(recipe => recipe.toJSON())
}

module.exports = {
  initialRecipes, recipesInDb
}