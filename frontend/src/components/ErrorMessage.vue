<template>
    <div class="errorMessage" v-if="message">
        {{ message }}
    </div>
</template>

<script>
export default {
    name: 'ErrorMessage',
    props: {
        message: {
            type: String,
            required: true
        }
    }
}
</script>

<style>
.errorMessage {
    border: 1px solid #006d77;
    background-color: white;
    color: black;
    padding: 10px;
    border-radius: 10px;
    font-size: 20px;
    width: fit-content;
    margin: auto;
    margin-top: 10px;
}
</style>