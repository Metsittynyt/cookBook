<template>
  <div class="overlay">
    <div id="create_overlay">
      <h1>{{ isEditing ? 'Edit Recipe' : 'Add New Recipe' }}</h1>
      <button class="close_button" @click="overlay_off">x</button>
      <RecipeForm :initialRecipe="initialRecipe" @submit-success="$emit('submit-success')" />
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
  props: {
    initialRecipe: {
      type: Object,
      default: null // Allow null to represent adding a new recipe
    }
  },
  computed: {
    isEditing() {
      return this.initialRecipe && this.initialRecipe.id; // Check if initialRecipe is not null and has an id
    }
  },
  methods: {
    overlay_off() {
      console.log("overlay off")
      this.$emit('close-overlay');
    }
  }
}
</script>
