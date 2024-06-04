const mongoose = require('mongoose')


const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: String,
  steps: String,
  public: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

recipeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Recipe', recipeSchema)