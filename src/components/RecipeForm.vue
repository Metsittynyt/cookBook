<template>
  <div class="recipe-form">
    <form @submit.prevent="submitRecipe">
      <div class="form-group">
        <label for="recipeName">Recipe Name:</label>
        <input type="text" id="recipeName" v-model="recipe.name" required>
      </div>
      <div class="form-group">
        <label for="ingredients">Ingredients:</label>
        <textarea id="ingredients" v-model="recipe.ingredients" required rows="5"></textarea>
      </div>
      <div class="form-group">
        <label for="steps">Preparation Steps:</label>
        <textarea id="steps" v-model="recipe.steps" required rows="7"></textarea>
      </div>
      <button type="submit">Submit Recipe</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      recipe: {
        name: '',
        ingredients: '',
        steps: ''
      }
    };
  },
  name: 'RecipeForm',
  methods: {
    submitRecipe() {
      console.log("Submitting recipe:", this.recipe);
      alert('Recipe submitted! Check the console for details.');
      this.resetForm();
    },
    resetForm() {
      this.recipe = { name: '', ingredients: '', steps: '' };
    }
  }
}
</script>