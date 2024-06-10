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
        time: '',
        difficulty: '',
        tags: [],
        public: false
      })
    }
  },
  data() {
    return {
      recipe: { ...this.initialRecipe },
      error: null,
      isEditing: !!this.initialRecipe && !!this.initialRecipe.id,
      tags: ['Sweet', 'Salty', 'Sour', 'Vegan', 'Vegetarian', 'Dairy',
        'Dairy-free', 'Lunch', 'Dinner', 'Snack', 'Dessert'],
      selectedTags: [],
      difficultyLabel: 'Easy',
      formattedCookingTime: '30 mins'
    };
  },
  methods: {
    async handleSubmit(e) {
      e.preventDefault();

      this.recipe.tags = this.selectedTags;
      this.recipe.time = this.formattedCookingTime;
      this.recipe.difficulty = this.difficultyLabel;

      try {
        if (this.isEditing) {
          await recipeService.update(this.recipe.id, this.recipe);
        } else {
          await recipeService.create(this.recipe, localStorage.getItem("token"));
        }
        this.$emit('submit-success');
        this.resetForm();  // Reset the form after successful submission
      } catch (error) {
        this.error = error;
      }
    },
    resetForm() {
      this.recipe = { ...this.initialRecipe, tags: [], public: false };
      this.selectedTags = [];
      this.error = null;
      this.isEditing = false;
    },
    updateCookingTimeLabel() {
      const hours = Math.floor(this.recipe.cookingTime / 60);
      const minutes = this.recipe.cookingTime % 60;
      if (hours === 0) {
        this.formattedCookingTime = `${minutes} mins`;
      } else {
        this.formattedCookingTime = `${hours} hr${hours > 1 ? 's' : ''} ${minutes} mins`;
      }
    },
    updateDifficultyLabel() {
      const levels = {
        1: 'Easy',
        2: 'Medium',
        3: 'Difficult',
        4: 'Expert'
      };
      this.difficultyLabel = levels[this.recipe.difficulty];
    }
  },
  watch: {
    initialRecipe: {
      immediate: true,
      handler(newRecipe) {
        this.recipe = { ...newRecipe };
        this.isEditing = !!newRecipe && !!newRecipe.id;
      }
    },
    'recipe.cookingTime': function () {
      this.updateCookingTimeLabel();
    }
  },
  mounted() {
    this.updateCookingTimeLabel();
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