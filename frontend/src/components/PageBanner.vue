<template>
    <div :class="['banner', bannerClass]"></div>
</template>

<script>
export default {
    name: 'PageBanner',
    props: {
        bannerClass: {
            type: String,
            default: ''
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
}

.home-banner {
    /*background-image: url('');*/
    background-color: var(--lightBlue);
}


</style>