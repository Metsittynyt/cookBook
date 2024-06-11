<template>
    <div class="recipe_detail">
        <div v-if="recipe">
            <h1>{{ recipe.name }}</h1>
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
</style>