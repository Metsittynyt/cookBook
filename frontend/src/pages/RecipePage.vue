<template>
    <div class="recipe_detail">
        <div v-if="recipe">
            <div class="header">
                <h1>{{ recipe.name }}</h1>
                <button v-if="isAuthenticated" class="bookmark" @click="handleSaveRecipe">
                    <i :class="isSaved ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
                </button>
            </div>
            <h3>Created by: {{ username }}</h3>
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
            <div v-if="isAuthenticated" class="likes-box">
                <i @click="handleRecipeLike" :class="['fa-heart', isLiked ? 'fas' : 'far']"></i>
                <p>{{ recipe.likes }}</p>
            </div>
            <div v-else class="likes-box">
                <i class="far fa-heart" style="font-size: 20px; color: black;"></i>
                <p>{{ recipe.likes }}</p>
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
import loginService from '@/services/login';

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
            username: '',
            recipe: null,
            isAuthenticated: false,
            isLiked: false,
            isSaved: false,
            error: null
        };
    },
    async created() {
        await this.checkAuthentication();
        await this.fetchRecipe();
        if (this.isAuthenticated) {
            await this.getName();
            this.checkIfLiked();
            this.checkIfSaved();
        }
    },
    methods: {
        async fetchRecipe() {
            const response = await recipeService.getById(this.id);
            this.recipe = response;
        },
        async getName() {
            const response = await loginService.getUsername();
            this.username = response;

        },
        splitText(text) {
            return text.split('\n');
        },
        formatTime(time) {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            return `${hours}h ${minutes}m`;
        },
        checkAuthentication() {
            const getCookie = (name) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
            };
            this.isAuthenticated = !!getCookie('auth_token');
        },
        async checkIfLiked() {
            if (this.isAuthenticated) {
                const response = await recipeService.toggleStatus(this.id, "like");
                this.isLiked = response.isLiked;
            }
        },
        async checkIfSaved() {
            if (this.isAuthenticated) {
                const response = await recipeService.toggleStatus(this.id, "save");
                this.isSaved = response.isSaved;
            }
        },
        async handleRecipeLike(e) {
            e.preventDefault();
            const updatedRecipe = {
                ...this.recipe,
                likeToggle: true
            };

            await recipeService.update(this.id, updatedRecipe);
            this.fetchRecipe();
            this.isLiked = !this.isLiked;
        },
        async handleSaveRecipe(e) {
            e.preventDefault();
            const updatedRecipe = {
                ...this.recipe,
                saveToggle: true
            };

            await recipeService.update(this.id, updatedRecipe);
            this.fetchRecipe();
            this.isSaved = !this.isSaved;
        }
    }
};
</script>

<style scoped>
.ingredients-box,
.steps-box {
    text-align: left;
    width: fit-content;
    margin: auto;
}

.time-box,
.likes-box {
    display: flex;
    justify-content: center;
    align-items: center;
}

.recipe_detail {
    margin: auto;
    margin-top: 10%;
    margin-bottom: 10%;
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