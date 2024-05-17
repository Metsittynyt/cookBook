<template>
  <div>
    <h2>My Recipes</h2>
    <div class="RecipesGrid">
      <div v-for="recipe in recipes" :key="recipe.id" class="recipe-cell">
        <i :class="['fas', 'fa-globe', recipe.public ? 'public-icon' : 'private-icon']" id="globe_icon"
          @click="togglePublicStatus(recipe)"></i>
        <i class="fas fa-trash-alt" id="trash_can_icon" @click="delete_recipe(recipe.id)"></i>
        <RecipeBox :recipe="recipe" />
        <i class="fas fa-edit" id="edit_icon" @click="edit_recipe(recipe)"></i>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import RecipeBox from './RecipeBox'

export default {
  name: 'MyRecipes',
  components: {
    RecipeBox
  },
  data() {
    return {
      recipes: [],
      error: null
    }
  },
  methods: {
    async delete_recipe(recipeId) {
      try {
        await axios.delete(`http://localhost:3001/recipes/${recipeId}`)
        this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId)
      } catch (error) {
        console.error('Error deleting recipe:', error)
        this.error = 'Failed to delete the recipe.'
      }
    },
    edit_recipe(recipe) {
      console.log("Edit: " + recipe.name)
      this.$emit('edit-recipe', recipe);
    },
    async togglePublicStatus(recipe) {
      try {
        recipe.public = !recipe.public; // Toggle the public status
        await axios.put(`http://localhost:3001/recipes/${recipe.id}`, recipe); // Send update to backend
      } catch (error) {
        console.error('Error updating recipe:', error);
        this.error = 'Failed to update the recipe.';
        // Revert the change if the request fails
        recipe.public = !recipe.public;
      }
    }
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:3001/recipes')
      this.recipes = response.data
      console.log(response.data)
    } catch (error) {
      this.error = error;
    }
  }
}
</script>