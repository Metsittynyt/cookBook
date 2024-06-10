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
            return this.quotes[this.bannerClass].replace(/\n/g, '<br>');
        }
    }
}
</script>

<style>
.banner {
    height: 200px;
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
</style>