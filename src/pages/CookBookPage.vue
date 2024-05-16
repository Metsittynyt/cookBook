<template>
  <div class="page">
    <h1>My cookbook</h1>
    <button @click="add_recipe">Add new recipe</button>
    <CreateOverlay v-if="showOverlay" :initialRecipe="selectedRecipe" @close-overlay="closeOverlay" @submit-success="closeOverlay" />
    <MyRecipes @edit-recipe="edit_recipe" />
    <h2>Saved recipes</h2>
    <div class="saved"></div>
  </div>
</template>

<script>
import CreateOverlay from '../components/CreateOverlay'
import MyRecipes from '@/components/MyRecipes.vue'

export default {
  name: 'CookBookPage',
  components: {
    CreateOverlay,
    MyRecipes
  },
  data() {
    return {
      showOverlay: false,
      selectedRecipe: null
    }
  },
  methods: {
    add_recipe() {
      console.log("Add new recipe...")
      this.selectedRecipe = null;
      this.showOverlay = true;
    },
    edit_recipe(recipe) {
      this.selectedRecipe = recipe;
      this.showOverlay = true;
    },
    closeOverlay() {
      this.showOverlay = false;
      // You might also want to refresh the recipes list here
      // this.$refs.myRecipes.loadRecipes();
    }
  }
}
</script>
