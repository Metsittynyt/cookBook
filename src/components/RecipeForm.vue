<template>
  <div class="recipe-form">
    <div v-if="error">
      {{ error }}
    </div>
    <form id="form" v-on:submit="handleSubmit" v-else>
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
      <div class="form-group">
        <label for="publicCheck">Publish?</label>
        <input type="checkbox" id="publicCheck" v-model="recipe.public">
      </div>
      <button type="submit">Submit Recipe</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      recipe: {
        name: '',
        ingredients: '',
        steps: '',
        public: false
      }
    };
  },
  name: 'RecipeForm',
  methods: {
    handleSubmit: async function (e) {
      e.preventDefault();

      try {
        const response = await axios.post('http://localhost:3001/recipes', this.recipe)
        console.log(response);
      } catch (error) {
        this.error = error;
      }
      this.resetForm();
      document.querySelector(".overlay").style.display = "none";
    },
    resetForm() {
      this.recipe = { name: '', ingredients: '', steps: '', public: false };
    }
  }
}
</script>