<template>
    <div :class="['message', messageType]" v-if="messageObject">
        {{ messageObject.text }}
    </div>
</template>

<script>
export default {
    name: 'MessageComponent',
    props: {
        messageObject: {
            type: Object,
            required: true,
            validator: function (value) {
                // eslint-disable-next-line no-prototype-builtins
                return value.hasOwnProperty('text') && value.hasOwnProperty('type');
            }
        }
    },
    computed: {
        messageType() {
            return this.messageObject.type === 'error' ? 'errorMessage' : 'successMessage';
        }
    }
}
</script>

<style>
.message {
    color: black;
    padding: 10px;
    border-radius: 10px;
    font-size: 20px;
    width: fit-content;
    margin: auto;
    margin-top: 10px;
}

.errorMessage {
    border: 1px solid #E29578;
    background-color: #FFDDD2;
}

.successMessage {
    border: 1px solid #006D77;
    background-color: #83C5BE;
}
</style>