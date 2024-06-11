<template>
    <div class="my-recipe">
        <h3>{{ recipe.name }}</h3>
        <div id="ingredients">
            <h4>Ingredients:</h4>
            <ul>
                <li v-for="ingredient in splitText(recipe.ingredients)" :key="ingredient">{{ ingredient }}</li>
            </ul>
        </div>
        <div id="steps">
            <h4>Steps:</h4>
            <ol>
                <li v-for="step in splitText(recipe.steps)" :key="step">{{ step }}</li>
            </ol>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MyRecipeBox',
    props: {
        recipe: {
            type: Object,
            required: true
        }
    },
    methods: {
        splitText(text) {
            return text.split('\n');
        }
    }
}
</script>