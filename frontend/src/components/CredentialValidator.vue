<template>
    <div class="requirements">
        <div v-if="type === 'username'">
            <div v-for="(label, key) in usernameLabels" :key="key" class="requirement">
                <input type="checkbox" :checked="usernameRequirements[key]" disabled>
                <label>{{ label }}</label>
            </div>
        </div>
        <div v-if="type === 'password'">
            <div v-for="(label, key) in passwordLabels" :key="key" class="requirement">
                <input type="checkbox" :checked="passwordRequirements[key]" disabled>
                <label>{{ label }}</label>
            </div>
        </div>
    </div>
</template>

<script>
import userService from '../services/users';

export default {
    name: 'CredentialValidator',
    props: {
        password: {
            type: String,
            required: false
        },
        username: {
            type: String,
            required: false
        },
        type: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isUsernameValid: null // null = unchecked, true = valid, false = invalid
        };
    },
    watch: {
        username: 'checkUsername'
    },
    methods: {
        async checkUsername() {
            if (this.username) {
                try {
                    const isUnique = await userService.checkUsername(this.username);
                    this.isUsernameValid = isUnique;
                    this.$emit('username-validity', isUnique);
                } catch (error) {
                    console.error('Failed to check username uniqueness', error);
                    this.isUsernameValid = false;
                    this.$emit('username-validity', false);
                }
            }
        }
    },
    computed: {
        passwordRequirements() {
            return {
                length: this.password.length >= 8,
                uppercase: /[A-Z]/.test(this.password),
                lowercase: /[a-z]/.test(this.password),
                number: /[0-9]/.test(this.password),
                special: /[!@#$%^&*(),.?":{}|<>]/.test(this.password),
            };
        },
        usernameRequirements() {
            return {
                unique: this.isUsernameValid,
                length: this.username.length >= 3,
                content: this.username != null
            };
        },
        passwordLabels() {
            return {
                length: 'At least 8 characters',
                uppercase: 'At least 1 uppercase letter',
                lowercase: 'At least 1 lowercase letter',
                number: 'At least 1 number',
                special: 'At least 1 special character'
            };
        },
        usernameLabels() {
            return {
                unique: 'Username is available',
                length: 'At least 3 characters'
            };
        }
    },
    mounted() {
        this.checkUsername();
    }
};
</script>

<style>
.requirements {
    margin: none;
}

.requirements .requirement {
    display: flex;
    align-items: center;
}

.requirements input[type="checkbox"] {
    appearance: none;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    border: none;
    border-radius: 3px;
    position: relative;
    display: inline-block;
}

.requirements input[type="checkbox"]:checked {
    border: none;
}

.requirements input[type="checkbox"]:checked::before {
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

.requirements input[type="checkbox"]:not(:checked)::before {
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

.requirements label {
    margin-left: 10px;
}
</style>
