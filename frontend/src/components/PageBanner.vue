<template>
    <div :class="['banner', bannerClass]">
        <p class="quote" v-html="formattedQuote"></p>
    </div>
</template>


<script>
export default {
    name: 'PageBanner',
    props: {
        bannerClass: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            quotes: {
                'home-banner': 'People who love to eat are always the best people.\n— Julia Child',
                'cookbook-banner': 'One cannot think well, love well, sleep well, if one has not dined well.\n— Virginia Woolf',
                'user-banner': 'Food is everything we are.\n— Anthony Bourdain'
            }
        };
    },
    computed: {
        formattedQuote() {
            const quote = this.quotes[this.bannerClass] || '';
            return quote.replace(/\n/g, '<br>'); // This will now always have a valid string to operate on
        }
    }

}
</script>

<style>
.banner {
    height: fit-content;
    width: 100%;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    text-align: center;
    align-content: center;
    font-size: x-large;
    font-weight: bold;
    color: black;
    text-shadow: 2px 2px lightgray;
    white-space: pre-wrap;
}

.home-banner {
    background-color: var(--lightGreen);
}

.cookbook-banner {
    background-color: var(--lightRed);
}


.user-banner {
    background-color: var(--lightBlue);
}

.recipe-banner,
.create-banner,
.edit-banner {
    height: 0px;
}
</style>