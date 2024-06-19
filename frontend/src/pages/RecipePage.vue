<template>
    <div class="recipe-detail">
        <div class="recipeTop"></div>
        <div v-if="recipe" class="recipeContent">
            <div class="header">
                <h1>{{ recipe.name }}</h1>
                <button v-if="isAuthenticated" class="bookmark" @click="handleSaveRecipe">
                    <i :class="isSaved ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
                </button>
            </div>
            <div class="content">
                <h3>Created by: {{ username }}</h3>
                <div class="difficulty_box">
                    <img v-for="index in 4" :key="index" :src="require('@/assets/photos/cookhat.png')" alt="cookhat"
                        :class="{ colored: index <= recipe.difficulty }" class="difficulty_level">
                </div>
                <div class="time-box">
                    <i class="far fa-hourglass"></i>
                    <p>{{ formatTime(recipe.time) }}</p>
                </div>
                <div class="ingredients-box">
                    <h4>Ingredients:</h4>
                    <ul>
                        <li v-for="ingredient in splitText(recipe.ingredients)" :key="ingredient">{{ ingredient }}</li>
                    </ul>
                </div>
                <div class="steps-box">
                    <h4>Steps:</h4>
                    <ol>
                        <li v-for="step in splitText(recipe.steps)" :key="step">{{ step }}</li>
                    </ol>
                </div>
                <div class="likes-box">
                    <i v-if="isAuthenticated" @click="handleRecipeLike"
                        :class="['fa-heart', isLiked ? 'fas' : 'far']"></i>
                    <i v-else class="fas fa-heart" style="font-size: 20px; color: black;"></i>
                    <p>{{ recipe.likes }}</p>
                </div>
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
        await this.getName();
        if (this.isAuthenticated) {
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
            console.log(this.recipe.user)
            const response = await loginService.getById(this.recipe.user);
            this.username = response.username;

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
p {
    margin: 0px 0px 0px 10px;
    font-size: large;
}

h3 {
    margin-top: 0px;
    font-weight: normal;
}

h1,
h3,
h4 {
    margin-bottom: 0px;
}

.ingredients-box,
.steps-box {
    padding: 0px 30px 0px 30px;
}

ul,
ol {
    text-align: left;
    width: fit-content;
    margin: auto;
}

li {
    margin: 2.5px 0px 2.5px;
}

.time-box,
.likes-box {
    display: flex;
    justify-content: center;
    align-items: center;
}

.content {
    gap: 10px;
    padding-bottom: 20px;
}

.recipe-detail {
    min-width: 260px;
    max-width: 500px;
    box-shadow: 4px 4px #83c5be;
    margin: 30px auto 30px auto;
}

.recipe_detail .header .bookmark {
    position: relative;
}

@media (max-width: 500px) {
    .recipe_detail {
        padding: 5px;
    }

    h1 {
        font-size: x-large;
    }

    h3 {
        font-size: large;
    }
}
</style>