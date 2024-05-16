<template>
  <div class="page">
    <h1>Recipes</h1>
    <div class="RecipesGrid">
      <div v-for="recipe in publicRecipes" :key="recipe.id" class="recipe-cell">
        <RecipeBox :recipe="recipe" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import RecipeBox from '@/components/RecipeBox.vue';

export default {
  name: 'HomePage',
  components: {
    RecipeBox
  },
  data() {
    return {
      publicRecipes: [],
      error: null
    };
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:3001/recipes');
      this.publicRecipes = response.data.filter(recipe => recipe.public);
    } catch (error) {
      this.error = 'Failed to fetch recipes';
      console.error(error);
    }
  }
};
</script>