<template>
    <div class="recipe_detail">
        <div v-if="recipe">
            <div class="header">
                <h1>{{ recipe.name }}</h1>
                <button class="bookmark">
                    <i class="far fa-bookmark" style="font-size: 30px; color: black"></i>
                </button>
            </div>
            <h3>Created by: </h3>
            <h3>Difficulty:</h3>
            <div class="difficulty_box">
                <img v-for="index in 4" :key="index" :src="require('@/assets/photos/cookhat.png')" alt="cookhat"
                    :class="{ colored: index <= recipe.difficulty }" class="difficulty_level">
            </div>
            <h3>Cooking time:</h3>
            <div class="time-box">
                <i class="far fa-hourglass"></i>
                <p>{{ formatTime(recipe.time) }}</p>
            </div>
            <div>
                <h4>Ingredients:</h4>
                <ul class="ingredients-box">
                    <li v-for="ingredient in splitText(recipe.ingredients)" :key="ingredient">{{ ingredient }}</li>
                </ul>
            </div>
            <div>
                <h4>Steps:</h4>
                <ol class="steps-box">
                    <li v-for="step in splitText(recipe.steps)" :key="step">{{ step }}</li>
                </ol>
            </div>
            <div class="likes-box">
                <i class="far fa-heart" style="font-size: 20px; color: black;"></i>
                <p>Likes</p>
            </div>
        </div>
        <div v-else-if="error">
            <p>{{ error }}</p>
        </div>
        <div v-else>
            <p>Loading...</p>
        </div>
    </div>
</template>

<script>
import recipeService from '@/services/recipes';

export default {
    name: 'RecipePage',
    props: {
        id: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            recipe: null,
            error: null
        };
    },
    methods: {
        async fetchRecipe() {
            try {
                const response = await recipeService.getById(this.id);
                if (response) {
                    this.recipe = response;
                } else {
                    this.error = 'Recipe not found';
                }
            } catch (error) {
                this.error = 'Failed to fetch recipe';
                console.error(error);
            }
        },
        splitText(text) {
            return text.split('\n');
        },
        formatTime(time) {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            return `${hours}h ${minutes}m`;
        }
    },
    created() {
        this.fetchRecipe();
    }
};
</script>

<style>
.ingredients-box,
.steps-box {
    text-align: left;
    width: fit-content;
    margin: auto;
}

.recipe_detail {
    margin: auto;
    padding: 20px;
    min-width: 300px;
    max-width: 500px;
    border: 1px solid rgb(180, 178, 178);
    border-radius: 10px;
}

.recipe_detail .header .bookmark {
    position: relative;
}
</style>