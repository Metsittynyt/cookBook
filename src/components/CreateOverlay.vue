<template>
    <div class="overlay">
        <div id="create_overlay">
            <h1>Add new recipe</h1>
            <button class="close_button" @click="overlay_off">x</button>
            <RecipeForm />
        </div>
    </div>
</template>

<script>
import RecipeForm from './RecipeForm'

export default {
    name: 'CreateOverlay',
    components: {
      RecipeForm
    },
    methods: {
    overlay_off() {
      console.log("overlay off")
      document.querySelector(".overlay").style.display = "none";
    }
  }
}
</script>
