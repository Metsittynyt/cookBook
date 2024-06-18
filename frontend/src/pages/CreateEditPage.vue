<template>
    <div>
        <h1>{{ isEditing ? 'Edit Recipe' : 'Create New Recipe' }}</h1>
        <RecipeForm :initialRecipe="recipe" :isEditing="isEditing" @submit-success="handleSuccess" />
    </div>
</template>

<script>
import RecipeForm from '@/components/RecipeForm.vue';
import recipeService from '@/services/recipes';

export default {
    name: 'RecipePage',
    components: {
        RecipeForm
    },
    props: {
        id: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            recipe: {
                name: '',
                ingredients: '',
                steps: '',
                time: 30,
                difficulty: 1,
                tags: [],
                public: false
            },
            error: null
        };
    },
    computed: {
        isEditing() {
            return !!this.id;
        }
    },
    async created() {
        if (this.isEditing) {
            try {
                const response = await recipeService.getById(this.id);
                this.recipe = response;
            } catch (error) {
                this.error = 'Failed to fetch the recipe for editing';
                console.error(error);
            }
        }
    },
    methods: {
        handleSuccess() {
            this.$router.push('/cookbook');
        }
    }
};
</script>