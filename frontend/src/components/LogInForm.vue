<template>
    <div class="login_form">
        <form id="form" @submit.prevent="submitLogin">
            <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" v-model="credentials.username" required>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <input type="text" id="password" v-model="credentials.password" required>
            </div>
            <button type="submit">Log in</button>
        </form>
    </div>
</template>

<script>
import loginService from '../services/login';

export default {
    name: 'LogInForm',
    data() {
        return {
            credentials: {
                username: '',
                password: ''
            },
            errorMessage: ''
        };
    },
    methods: {
        async submitLogin() {
            try {
                const response = await loginService.login(this.credentials);
                localStorage.setItem('token', response.token);
                localStorage.setItem('username', response.username);
                this.$router.push('/cookbook').then( () => {
                    window.location.reload();
                });
                console.log(this.credentials.username + " logged in successfully!")
                this.errorMessage = '';
            } catch (error) {
                console.error('Login failed', error);
                this.errorMessage = 'Failed to login. Please check your credentials.';
            }
        }
    }
}
</script>