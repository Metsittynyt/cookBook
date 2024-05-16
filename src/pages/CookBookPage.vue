<template>
  <div class="page">
    <h1>My cookbook</h1>
    <button @click="overlay_on">Add new recipe</button>
    <CreateOverlay />
    <h2>My recipes</h2>
    <div class="recipes">
      
    </div>
    <h2>Saved recipes</h2>
    <div class="saved">
      
    </div>
  </div>
</template>

<script>
import CreateOverlay from '../components/CreateOverlay'

export default {
  name: 'CookBookPage',
  components: {
    CreateOverlay
  },
  methods: {
    overlay_on() {
      console.log("overlay on")
      document.querySelector(".overlay").style.display = "block";
    }
  }
};
</script>