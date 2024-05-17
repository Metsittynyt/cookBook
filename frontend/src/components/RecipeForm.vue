<template>
  <div class="recipe-form">
    <div v-if="error">
      {{ error }}
    </div>
    <form id="form" @submit="handleSubmit" v-else>
      <div class="form-group">
        <label for="recipeName">Recipe Name:</label>
        <input type="text" id="recipeName" v-model="recipe.name" required>
      </div>
      <div class="form-group">
        <label for="ingredients">Ingredients:</label>
        <textarea id="ingredients" v-model="recipe.ingredients" required rows="5"></textarea>
      </div>
      <div class="form-group">
        <label for="steps">Preparation Steps:</label>
        <textarea id="steps" v-model="recipe.steps" required rows="7"></textarea>
      </div>
      <div class="form-group">
        <label for="publicCheck">Publish?</label>
        <input type="checkbox" id="publicCheck" v-model="recipe.public">
      </div>
      <button type="submit">{{ isEditing ? 'Update' : 'Submit' }} Recipe</button>
    </form>
  </div>
</template>

<script>
import recipeService from '@/services/recipes';

export default {
  name: 'RecipeForm',
  props: {
    initialRecipe: {
      type: Object,
      default: () => ({
        name: '',
        ingredients: '',
        steps: '',
        public: false
      })
    }
  },
  data() {
    return {
      recipe: { ...this.initialRecipe },
      error: null,
      isEditing: !!this.initialRecipe && !!this.initialRecipe.id
    };
  },
  methods: {
    async handleSubmit(e) {
      e.preventDefault();

      try {
        if (this.isEditing) {
          await recipeService.update(this.recipe.id, this.recipe);
        } else {
          await recipeService.create(this.recipe);
        }
        this.$emit('submit-success');
        this.resetForm();  // Reset the form after successful submission
      } catch (error) {
        this.error = error;
      }
    },
    resetForm() {
      this.recipe = { name: '', ingredients: '', steps: '', public: false };
      this.error = null;
      this.isEditing = false;
    }
  },
  watch: {
    initialRecipe: {
      immediate: true,
      handler(newRecipe) {
        this.recipe = { ...newRecipe };
        this.isEditing = !!newRecipe && !!newRecipe.id;
      }
    }
  }
};
</script>
