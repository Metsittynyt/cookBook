<template>
  <div>
    <h2>My Recipes</h2>
    <div class="RecipesGrid">
      <div v-for="recipe in recipes" :key="recipe.id" class="recipe-cell">
        <i :class="['fas', 'fa-globe', recipe.public ? 'public-icon' : 'private-icon']" id="globe_icon"
          @click="togglePublicStatus(recipe)"></i>
        <i class="fas fa-trash-alt" id="trash_can_icon" @click="delete_recipe(recipe.id)"></i>
        <MyRecipeBox :recipe="recipe" />
        <i class="fas fa-edit" id="edit_icon" @click="edit_recipe(recipe)"></i>
      </div>
    </div>
  </div>
</template>

<script>
import recipeService from '@/services/recipes';
import MyRecipeBox from './MyRecipeBox';

export default {
  name: 'MyRecipes',
  components: {
    MyRecipeBox
  },
  props: {
    recipes: Array
  },
  data() {
    return {
      error: null
    }
  },
  methods: {
    async fetchRecipes() {
      try {
        const recipes = await recipeService.getAll();
        this.$emit('update:recipes', recipes);
      } catch (error) {
        this.error = 'Failed to fetch recipes';
        console.error(error);
      }
    },
    async delete_recipe(recipeId) {
      try {
        await recipeService.getRidOff(recipeId);
        this.$emit('change'); // Emit change event to notify parent to refresh recipes
      } catch (error) {
        console.error('Error deleting recipe:', error);
        this.error = 'Failed to delete the recipe.';
      }
    },
    edit_recipe(recipe) {
      console.log("Edit: " + recipe.name);
      this.$emit('edit-recipe', recipe);
    },
    async togglePublicStatus(recipe) {
      try {
        recipe.public = !recipe.public; // Toggle the public status
        await recipeService.update(recipe.id, recipe); // Send update to backend
        this.$emit('change'); // Emit change event to notify parent to refresh recipes
      } catch (error) {
        console.error('Error updating recipe:', error);
        this.error = 'Failed to update the recipe.';
        // Revert the change if the request fails
        recipe.public = !recipe.public;
      }
    }
  }
}
</script>
