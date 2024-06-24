<template>
    <div class="password-requirements">
        <div v-for="(label, key) in labels" :key="key" class="requirement">
            <input type="checkbox" :checked="requirements[key]" disabled>
            <label>{{ label }}</label>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        password: {
            type: String,
            required: true
        }
    },
    computed: {
        requirements() {
            return {
                length: this.password.length >= 8,
                uppercase: /[A-Z]/.test(this.password),
                lowercase: /[a-z]/.test(this.password),
                number: /[0-9]/.test(this.password),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(this.password),
            };
        },
        labels() {
            return {
                length: 'At least 8 characters',
                uppercase: 'At least 1 uppercase letter',
                lowercase: 'At least 1 lowercase letter',
                number: 'At least 1 number',
                special: 'At least 1 special character'
            };
        }
    }
};
</script>

<style>
.password-requirements {
    margin: none;
}

.password-requirements .requirement {
    display: flex;
    align-items: center;
}

.password-requirements input[type="checkbox"] {
    appearance: none;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    border: none;
    border-radius: 3px;
    position: relative;
    display: inline-block;
}

.password-requirements input[type="checkbox"]:checked {
    border: none;
}

.password-requirements input[type="checkbox"]:checked::before {
    content: "✔";
    display: block;
    color: #006d77;
    font-weight: bold;
    font-size: 18px;
    text-align: center;
    position: absolute;
    top: -2px;
    left: 0;
    width: 100%;
    height: 100%;
}

.password-requirements input[type="checkbox"]:not(:checked)::before {
    content: "✘";
    display: block;
    color: #E29578;
    font-weight: bold;
    font-size: 18px;
    text-align: center;
    position: absolute;
    top: -2px;
    left: 0;
    width: 100%;
    height: 100%;
}

.password-requirements label {
    margin-left: 10px;
}
</style>
