<template>
    <div class="login_form">
        <form id="form" @submit.prevent="submit">
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

            <div v-if="isSignUp" class="form-group">
                <label for="name">Name:</label>
                <input type="text" id="name" v-model="credentials.name" required>
            </div>

            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="credentials.username" required>
            </div>

            <div class="form-group">
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="credentials.password" required>
            </div>

            <!-- Password confirmation field for signing up -->
            <div v-if="isSignUp" class="form-group">
                <label for="passwordConfirm">Confirm Password:</label>
                <input type="password" id="passwordConfirm" v-model="passwordConfirm" required>
            </div>

            <button type="submit">{{ isSignUp ? 'Sign Up' : 'Log in' }}</button>
        </form>
    </div>
</template>

<script>
import loginService from '../services/login';

export default {
    name: 'LogInForm',
    props: {
        isSignUp: Boolean // Indicates if the form is used for signing up
    },
    data() {
        return {
            credentials: {
                name: '',
                username: '',
                password: ''
            },
            passwordConfirm: '',
            errorMessage: ''
        };
    },
    methods: {
        async submit() {
            if (this.isSignUp) {
                // Additional validation for signup process
                if (this.credentials.password !== this.passwordConfirm) {
                    this.errorMessage = 'Passwords do not match.';
                    return;
                }
                try {
                    const response = await loginService.signUp(this.credentials);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('username', response.username);
                    this.$router.push('/cookbook').then(() => window.location.reload());
                    console.log(this.credentials.username + " signed up successfully!");
                } catch (error) {
                    console.error('Signup failed', error);
                    this.errorMessage = 'Failed to sign up. Please check your input.';
                }
            } else {
                // Login process
                try {
                    const response = await loginService.login(this.credentials);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('username', response.username);
                    this.$router.push('/cookbook').then(() => window.location.reload());
                    console.log(this.credentials.username + " logged in successfully!");
                } catch (error) {
                    console.error('Login failed', error);
                    this.errorMessage = 'Failed to login. Please check your credentials.';
                }
            }
        }
    }
}
</script>