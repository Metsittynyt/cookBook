<template>
  <div>
    <h1>My cookbook</h1>
    <button @click="add_recipe">Add new recipe</button>
    <CreateOverlay v-if="showOverlay" :initialRecipe="selectedRecipe" @close-overlay="closeOverlay"
      @submit-success="handleSuccess" />
    <MyRecipes :recipes="myRecipes" @edit-recipe="edit_recipe" @change="fetchRecipes" />
    <h2>Saved recipes</h2>
    <p v-if="savedRecipes.length <= 0">Your saved recipes will appear here. Start by exploring the wide range of options
      and save the ones you love!
    </p>
    <div class="RecipesGrid">
      <div v-for="recipe in savedRecipes" :key="recipe.id" class="recipe">
        <RecipeBox :recipe="recipe" @update:recipe="handleRecipeUpdate" />
      </div>
    </div>
  </div>
</template>

<script>
import recipeService from '@/services/recipes'
import CreateOverlay from '../components/CreateOverlay'
import MyRecipes from '../components/MyRecipes'
import RecipeBox from '@/components/RecipeBox.vue';

export default {
  name: 'CookBookPage',
  components: {
    CreateOverlay,
    MyRecipes,
    RecipeBox
  },
  data() {
    return {
      showOverlay: false,
      selectedRecipe: null,
      myRecipes: [],
      savedRecipes: []
    }
  },
  methods: {
    async fetchRecipes() {
      this.myRecipes = await recipeService.getSome(true);
      this.savedRecipes = await recipeService.getSome(false, false, true)
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
    },
    handleRecipeUpdate() {
      this.fetchRecipes()
    }
  },
  async mounted() {
    await this.fetchRecipes();
  }
}
</script>
