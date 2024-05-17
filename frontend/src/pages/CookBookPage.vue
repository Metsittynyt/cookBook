<template>
  <div class="page">
    <h1>My cookbook</h1>
    <button @click="add_recipe">Add new recipe</button>
    <CreateOverlay 
      v-if="showOverlay" 
      :initialRecipe="selectedRecipe" 
      @close-overlay="closeOverlay" 
      @submit-success="handleSuccess" 
    />
    <MyRecipes :recipes="recipes" @edit-recipe="edit_recipe" @change="fetchRecipes"/>
    <h2>Saved recipes</h2>
    <div class="saved"></div>
  </div>
</template>

<script>
import CreateOverlay from '../components/CreateOverlay'
import MyRecipes from '../components/MyRecipes'
import recipeService from '@/services/recipes'

export default {
  name: 'CookBookPage',
  components: {
    CreateOverlay,
    MyRecipes
  },
  data() {
    return {
      showOverlay: false,
      selectedRecipe: null,
      recipes: []
    }
  },
  methods: {
    async fetchRecipes() {
      try {
        this.recipes = await recipeService.getAll();
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      }
    },
    add_recipe() {
      console.log("Add new recipe...")
      this.selectedRecipe = {
        name: '',
        ingredients: '',
        steps: '',
        public: false
      };
      this.showOverlay = true;
    },
    edit_recipe(recipe) {
      this.selectedRecipe = recipe;
      this.showOverlay = true;
    },
    closeOverlay() {
      this.showOverlay = false;
    },
    handleSuccess() {
      this.closeOverlay();
      this.fetchRecipes(); // Fetch recipes after successful submit
    }
  },
  async mounted() {
    await this.fetchRecipes();
  }
}
</script>
