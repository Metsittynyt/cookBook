<template>
  <div>
    <h1>Recipes</h1>
    <button id="empty" @click="emptyQuery">x</button>
    <input type="text" v-model="searchQuery" placeholder="Search recipes..." class="search-input">
    <button @click="performSearch">Search</button>
    <p>{{ numOfRecipes }} recipes found.</p>
    <div class="RecipesGrid">
      <div v-for="recipe in filteredRecipes" :key="recipe.id">
        <RecipeBox :recipe="recipe" @update:recipe="handleRecipeUpdate" />
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
      searchQuery: '',
      activeSearchQuery: '',
      isAuthenticated: false,
      error: null
    };
  },
  computed: {
    filteredRecipes() {
      if (!this.activeSearchQuery) {
        return this.publicRecipes;
      }
      return this.publicRecipes.filter(recipe => {
        return recipe.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      });
    },
    numOfRecipes() {
      return this.filteredRecipes.length;
    }
  },
  methods: {
    async fetchPublicRecipes() {
      let response;
      if (this.isAuthenticated) {
        response = await recipeService.getSome(false, true);
      } else {
        response = await recipeService.getAll();
      }
      console.log(this.isAuthenticated)
      if (response && Array.isArray(response)) {
        this.publicRecipes = response.filter(recipe => recipe.public);
      } else {
        this.error = 'Unexpected response format';
      }
    },
    checkAuthentication() {
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };
      return this.isAuthenticated = !!getCookie('auth_token');
    },
    performSearch() {
      this.activeSearchQuery = this.searchQuery;
    },
    emptyQuery() {
      this.searchQuery = ''
    },
    handleRecipeUpdate(updatedRecipe) {
      this.recipe = updatedRecipe;
      this.fetchPublicRecipes()
    }
  },
  async mounted() {
    this.checkAuthentication();
    await this.fetchPublicRecipes();
  }
};
</script>
