<template>
  <div>
    <h2>My Recipes</h2>
    <p v-if="recipes.length <= 0">Your own recipes will appear here. Start by clicking the button above!</p>
    <div v-if="error" class="error-message">{{ error }}</div>
    <div class="RecipesList">
      <div v-for="recipe in recipes" :key="recipe.id" class="recipe-list-item">
        <router-link :to="`/${recipe.id}`">
          <h3>{{ recipe.name }}</h3>
        </router-link>
        <div>
          <i class="fas fa-edit" id="edit-icon" @click="edit_recipe(recipe)" aria-label="Edit Recipe"></i>
          <i :class="['fas', 'fa-globe', recipe.public ? 'public-icon' : 'private-icon']" id="globe-icon"
            @click="togglePublicStatus(recipe)" aria-label="Toggle Public/Private"></i>
          <i class="fas fa-trash-alt" id="trash-can-icon" @click="delete_recipe(recipe.id)"
            aria-label="Delete Recipe"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import recipeService from '@/services/recipes';

export default {
  name: 'MyRecipes',
  components: {
  },
  props: {
    recipes: Array
  },
  data() {
    return {
      error: null
    }
  },
  methods: {
    async fetchRecipes() {
      try {
        const recipes = await recipeService.getAll();
        this.$emit('update:recipes', recipes);
      } catch (error) {
        this.error = 'Failed to fetch recipes';
        console.error(error);
      }
    },
    async delete_recipe(recipeId) {
      try {
        await recipeService.getRidOff(recipeId);
        this.$emit('change'); // Emit change event to notify parent to refresh recipes
      } catch (error) {
        console.error('Error deleting recipe:', error);
        this.error = 'Failed to delete the recipe.';
      }
    },
    edit_recipe(recipe) {
      console.log("Edit: " + recipe.name);
      this.$emit('edit-recipe', recipe);
    },
    async togglePublicStatus(recipe) {
      try {
        recipe.public = !recipe.public; // Toggle the public status
        await recipeService.update(recipe.id, recipe); // Send update to backend
        this.$emit('change'); // Emit change event to notify parent to refresh recipes
      } catch (error) {
        console.error('Error updating recipe:', error);
        this.error = 'Failed to update the recipe.';
        // Revert the change if the request fails
        recipe.public = !recipe.public;
      }
    }
  }
}
</script>

<style>
.RecipesList {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
  gap: 20px;
}

.recipe-list-item {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 10px;
  border: 1px solid #006d77;
  box-shadow: 4px 4px #83c5be;
  align-items: center;
  width: 300px;
  background: white;
  background-image: linear-gradient(90deg,
      transparent 30px,
      #E29578 30px,
      #E29578 32px,
      transparent 32px),
    linear-gradient(#EDF6F9 0.1em, transparent 0.1em);
  background-size: 100% 30px;
}

.recipe-list-item h3,
.recipe-list-item div {
  margin: 0px 10px;
}

.recipe-list-item a {
  color: #006d77;
  text-decoration: none;
}

.recipe-list-item div {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
}

#globe-icon,
#trash-can-icon,
#edit-icon {
  margin: 10px;
}

#trash-can-icon,
#edit-icon {
  color: #006d77;
}

.public-icon {
  color: #006d77;
}

.private-icon {
  color: #E29578;
}
</style>