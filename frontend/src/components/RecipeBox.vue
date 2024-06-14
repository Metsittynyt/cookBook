<template>
    <div class="header">
        <router-link :to="`/${recipe.id}`">
            <h3>{{ recipe.name }}</h3>
        </router-link>
        <button v-if="isAuthenticated" class="bookmark" @click="handleSaveRecipe">
            <i :class="isSaved ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
        </button>
    </div>
    <div class="content">
        <div class="difficulty_box">
            <img v-for="index in 4" :key="index" :src="require('@/assets/photos/cookhat.png')" alt="cookhat"
                :class="{ colored: index <= recipe.difficulty }" class="difficulty_level">
        </div>
        <div class="time-box">
            <i class="far fa-hourglass"></i>
            <p>{{ formatTime(recipe.time) }}</p>
        </div>
        <div class="tags_box">
            <span v-for="tag in (recipe.tags)" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div v-if="isAuthenticated" class="likes-box">
            <i @click="handleRecipeLike" :class="['fa-heart', isLiked ? 'fas' : 'far']"></i>
            <p>{{ recipe.likes }}</p>
        </div>
    </div>
</template>


<script>
import recipeService from '@/services/recipes'

export default {
    name: 'RecipeBox',
    props: {
        recipe: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isAuthenticated: false,
            savedRecipes: [],
            isLiked: false,
            isSaved: false,
        };
    },
    created() {
        this.checkAuthentication();
        this.checkIfLiked();
        this.checkIfSaved();
    },
    methods: {
        checkAuthentication() {
            const getCookie = (name) => {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
            };
            return this.isAuthenticated = !!getCookie('auth_token');
        },
        async checkIfLiked() {
            if (this.isAuthenticated) {
                const response = await recipeService.toggleStatus(this.recipe.id, "like");
                this.isLiked = response.isLiked;
            }
        },
        async checkIfSaved() {
            if (this.isAuthenticated) {
                const response = await recipeService.toggleStatus(this.recipe.id, "save");
                this.isSaved = response.isSaved;
            }
        },
        splitText(text) {
            return text.split('\n');
        },
        formatTime(time) {
            const hours = Math.floor(time / 60);
            const minutes = time % 60;
            return `${hours}h ${minutes}m`;
        },
        async handleRecipeLike(e) {
            e.preventDefault();
            const updatedRecipe = {
                ...this.recipe,
                likeToggle: true
            };

            const response = await recipeService.update(this.recipe.id, updatedRecipe);
            if (response) {
                console.log("Success: ", response);
                this.$emit('update:recipe', response);
                this.isLiked = !this.isLiked;
            } else {
                console.error("Failed to update recipe");
            }
        },
        async handleSaveRecipe(e) {
            e.preventDefault();
            const updatedRecipe = {
                ...this.localRecipe,
                saveToggle: true
            };

            const response = await recipeService.update(this.recipe.id, updatedRecipe);
            if (response) {
                console.log("Success: ", response);
                this.$emit('update:recipe', response);
                this.isSaved = !this.isSaved;
            } else {
                console.error("Failed to update recipe");
            }
        }

    }
}
</script>

<style>
.recipe {
    position: relative;
    padding: 10px;
    border: 1px solid black;
    border-radius: 20px 0px 0px 0px;
    box-shadow: 4px 4px #00000042;
    width: 250px;
    text-align: center;
    background-color: rgb(245, 250, 245);
}

.header {
    display: flex;
    justify-content: center;
    position: relative;
}

.bookmark {
    position: absolute;
    top: 0;
    right: 0;
    background: none;
    border: none;
    cursor: pointer;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.difficulty_box {
    display: flex;
    margin: 8px 0;
    justify-content: center;
}

.difficulty_level {
    width: 50px;
    height: 50px;
    margin-right: 4px;
}

.difficulty_level.colored {
    filter: sepia(100%) hue-rotate(45deg) saturate(9) contrast(70%);
}

.difficulty_level:not(.colored) {
    filter: brightness(100%);
}

.time-box {
    display: flex;
    align-items: center;
    margin: 8px 0;
}

.time-box p {
    margin-left: 8px;
}

.tags_box {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
}

.tag {
    background: white;
    padding: 4px 8px;
    border: 1px solid black;
    border-radius: 4px;
}

.likes-box {
    display: flex;
    align-items: center;
    margin-top: 8px;
}

.likes-box p {
    margin-left: 8px;
}
</style>
