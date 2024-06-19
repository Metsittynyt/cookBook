<template>
    <div class="recipeTop"></div>
    <div class="recipeContent">
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
            <div class="likes-box">
                <i v-if="isAuthenticated" @click="handleRecipeLike" :class="['fa-heart', isLiked ? 'fas' : 'far']"></i>
                <i v-else class="fas fa-heart"></i>
                <p>{{ recipe.likes }}</p>
            </div>
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
    width: 300px;
    box-shadow: 4px 4px #83c5be;
}

.recipeTop {
    height: 22px;
    width: 100%;
    background-image:
        linear-gradient(90deg,
            #fff 11px, 0,
            #83c5be 15px, 0,
            #edf6f9 21.5px, 0,
            #83c5be 23px, 0,
            #fff 99%),
        radial-gradient(circle at 17px 8px,
            rgba(255, 255, 255, 0) 40%,
            #83c5be 40%,
            #83c5be 45%,
            white 45%),
        radial-gradient(circle at 22px 8px,
            #edf6f9 40%,
            #83c5be 40%,
            #83c5be 100%);
    background-size: 32px 8px, 32px 16px, 32px 16px;
    background-repeat: space no-repeat;
    background-position: center top, center 6px, center 6px;
    border: 1px solid #006d77;
    border-top: none;
    border-bottom: none;
}

.recipeContent {
    min-width: 300px;
    max-width: 500px;
    border: 1px solid #006d77;
    border-top: none;
    background: white;
    background-image: linear-gradient(90deg,
            transparent 30px,
            #E29578 30px,
            #E29578 32px,
            transparent 32px),
        linear-gradient(#EDF6F9 0.1em, transparent 0.1em);
    background-size: 100% 30px;
}

.header {
    display: flex;
    justify-content: center;
    position: relative;
}

.header a {
    text-decoration: none;
    color: #006d77;
}

.bookmark {
    position: absolute;
    top: 0;
    right: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: #E29578;
    box-shadow: none;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* background-image: linear-gradient(white 10%, #006d77 10%, white 11%); */
    /* background-size: 10% 10%; */
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
    filter: sepia(50%) hue-rotate(301deg) saturate(40) contrast(90%);
}

.difficulty_level:not(.colored) {
    filter: brightness(100%);
}

.time-box {
    display: flex;
    align-items: center;
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
    color: #E29578
}

.likes-box p {
    margin-left: 8px;
    color: black;
}
</style>
