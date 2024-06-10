<template>
  <div>
    <h1>Recipes</h1>
    <div class="RecipesGrid">
      <div v-for="recipe in publicRecipes" :key="recipe.id" class="recipe-cell">
        <RecipeBox :recipe="recipe" />
      </div>
    </div>
  </div>
</template>

<script>
import recipeService from '@/services/recipes';
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
  methods: {
    async fetchPublicRecipes() {
      try {
        const response = await recipeService.getAll();
        if (response && Array.isArray(response)) {
          this.publicRecipes = response.filter(recipe => recipe.public);
        } else {
          this.error = 'Unexpected response format';
        }
        console.log("Home page: ", this.publicRecipes);
      } catch (error) {
        this.error = 'Failed to fetch recipes';
        console.error(error);
      }
    }
  },
  async mounted() {
    await this.fetchPublicRecipes();
  }
};
</script>