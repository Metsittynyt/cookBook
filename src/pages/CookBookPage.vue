<template>
  <div class="page">
    <h1>My cookbook</h1>
    <button @click="overlay_on">Add new recipe</button>
    <CreateOverlay />
    <MyRecipes />
    <h2>Saved recipes</h2>
    <div class="saved">
      
    </div>
  </div>
</template>

<script>
import CreateOverlay from '../components/CreateOverlay'
import MyRecipes from '@/components/MyRecipes.vue';

export default {
  name: 'CookBookPage',
  components: {
    CreateOverlay,
    MyRecipes
  },
  methods: {
    overlay_on() {
      console.log("overlay on")
      document.querySelector(".overlay").style.display = "block";
    }
  }
};
</script>