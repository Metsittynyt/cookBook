<template>
  <div>
    <div id="herbs-decoration"></div>
    <h1>My cookbook</h1>
    <button @click="add_recipe">Add new recipe</button>
    <MyRecipes :recipes="myRecipes" @edit-recipe="edit_recipe" @change="fetchRecipes" />
    <h2>Saved recipes</h2>
    <p v-if="savedRecipes.length <= 0">Your saved recipes will appear here. Start by exploring the wide range of options
      and save the ones you love!</p>
    <div class="RecipesGrid">
      <div v-for="recipe in savedRecipes" :key="recipe.id" class="recipe">
        <RecipeBox :recipe="recipe" @update:recipe="handleRecipeUpdate" />
      </div>
    </div>
  </div>
</template>

<script>
import recipeService from '@/services/recipes'
import MyRecipes from '../components/MyRecipes'
import RecipeBox from '@/components/RecipeBox.vue';

export default {
  name: 'CookBookPage',
  components: {
    MyRecipes,
    RecipeBox
  },
  data() {
    return {
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
      this.$router.push('/create');
    },
    edit_recipe(recipe) {
      this.$router.push(`/edit/${recipe.id}`);
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
