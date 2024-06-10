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
        <label for="cookingTimeSlider">Cooking Time: {{ formattedCookingTime }}</label>
        <input type="range" id="cookingTimeSlider" v-model="recipe.time" min="15" max="300" step="15"
          @input="updateCookingTimeLabel">
      </div>
      <div class="form-group">
        <label for="difficultySlider">Difficulty Level: {{ difficultyLabel }}</label>
        <input type="range" id="difficultySlider" v-model="recipe.difficulty" min="1" max="4" step="1"
          @input="updateDifficultyLabel">
      </div>
      <div class="form-group">
        <label>Tags</label>
        <div class="checkbox-container">
          <div class="checkbox-wrapper" v-for="(tag, index) in tags" :key="index">
            <input type="checkbox" :id="`tag-${index}`" v-model="selectedTags" :value="tag">
            <label :for="`tag-${index}`" class="custom-checkbox">{{ tag }}</label>
          </div>
        </div>
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
        time: 30,
        difficulty: 1,
        tags: [],
        public: false
      })
    }
  },
  data() {
    return {
      recipe: { ...this.initialRecipe },
      error: null,
      isEditing: !!this.initialRecipe.id,
      tags: ['Sweet', 'Salty', 'Sour', 'Vegan', 'Vegetarian', 'Dairy', 'Dairy-free', 'Lunch', 'Dinner', 'Snack', 'Dessert'],
      selectedTags: [],
      difficultyLabel: '',
      formattedCookingTime: ''
    };
  },
  methods: {
    async handleSubmit(e) {
      e.preventDefault();

      this.recipe.tags = this.selectedTags;

      try {
        const action = this.isEditing ? recipeService.update(this.recipe.id, this.recipe) : recipeService.create(this.recipe);
        const response = await action;
        console.log('Submission successful:', response);
        this.$emit('submit-success');
        this.resetForm();
      } catch (error) {
        console.error('Error submitting the recipe:', error);
        this.error = 'Failed to submit the recipe. Please try again.';
      }
    },
    resetForm() {
      this.recipe = { ...this.initialRecipe, tags: [], public: false, cookingTime: 30, difficulty: 1 };
      this.selectedTags = [];
      this.error = null;
      this.isEditing = false;
      this.updateCookingTimeLabel();
      this.updateDifficultyLabel();
    },
    updateCookingTimeLabel() {
      const hours = Math.floor(this.recipe.time / 60);
      const minutes = this.recipe.time % 60;
      this.formattedCookingTime = hours > 0 ? `${hours} hr${hours > 1 ? 's' : ''} ${minutes} min` : `${minutes} min`;
    },
    updateDifficultyLabel() {
      const levels = {
        1: 'Easy',
        2: 'Medium',
        3: 'Difficult',
        4: 'Expert'
      };
      this.difficultyLabel = levels[this.recipe.difficulty] || 'Easy';
    }
  },
  watch: {
    initialRecipe: {
      immediate: true,
      deep: true,
      handler(newRecipe) {
        this.recipe = { ...newRecipe };
        this.isEditing = !!newRecipe.id;
        this.selectedTags = newRecipe.tags ? [...newRecipe.tags] : [];
        this.updateCookingTimeLabel();
        this.updateDifficultyLabel();
      }
    },
    'recipe.cookingTime': function () {
      this.updateCookingTimeLabel();
    },
    'recipe.difficulty': function () {
      this.updateDifficultyLabel();
    }
  },
  mounted() {
    this.updateCookingTimeLabel();
    this.updateDifficultyLabel();
  }
};
</script>

<style>
.checkbox-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
}

.checkbox-wrapper input[type="checkbox"] {
  opacity: 0;
  position: absolute;
}

label.custom-checkbox {
  cursor: pointer;
  padding: 5px 15px;
  border: 2px solid #000;
  border-radius: 10px;
  display: inline-block;
  background-color: #fff;
  transition: background-color 0.3s, color 0.3s;
}

input[type="checkbox"]:checked+label {
  border: 4px solid var(--red);
}
</style>