const mongoose = require('mongoose')


const recipeSchema = new mongoose.Schema({
  name: String,
  ingredients: String,
  steps: String,
  time: String,
  difficulty: String,
  tags: [],
  public: Boolean,
  likes: Number,
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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