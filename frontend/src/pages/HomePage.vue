<template>
  <div>
    <h1>Recipes</h1>
    <button id="empty" @click="emptyQuery">x</button>
    <input type="text" v-model="searchQuery" placeholder="Search recipes..." class="search-input">
    <button @click="performSearch">Search</button>
    <p>{{ numOfRecipes }} recipes found.</p>
    <div class="RecipesGrid">
      <div v-for="recipe in filteredRecipes" :key="recipe.id">
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
      searchQuery: '',
      activeSearchQuery: '',
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
      try {
        const response = await recipeService.getAll();
        if (response && Array.isArray(response)) {
          this.publicRecipes = response.filter(recipe => recipe.public && recipe.user.username !== localStorage.getItem('username'));
        } else {
          this.error = 'Unexpected response format';
        }
      } catch (error) {
        this.error = 'Failed to fetch recipes';
        console.error(error);
      }
    },
    performSearch() {
      this.activeSearchQuery = this.searchQuery;
    },
    emptyQuery() {
      this.searchQuery = ''
    }
  },
  async mounted() {
    await this.fetchPublicRecipes();
  }
};
</script>
