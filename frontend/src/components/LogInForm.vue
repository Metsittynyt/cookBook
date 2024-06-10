<template>
    <div class="login_form">
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        <div class="wrapper">
            <div class="card-switch">
                <label class="switch">
                    <input type="checkbox" class="toggle" v-model="isSignUp">
                    <span class="slider"></span>
                    <span class="card-side"></span>
                    <div class="flip-card__inner">
                        <div class="flip-card__front">
                            <div class="title">Log in</div>
                            <form class="flip-card__form" @submit.prevent="submit">
                                <input class="flip-card__input" name="username" placeholder="Username" type="text"
                                    v-model="credentials.username" required>
                                <input class="flip-card__input" name="password" placeholder="Password" type="password"
                                    v-model="credentials.password" required>
                                <button type="submit" class="flip-card__btn">Let`s go!</button>
                            </form>
                        </div>
                        <div class="flip-card__back">
                            <div class="title">Sign up</div>
                            <form class="flip-card__form" @submit.prevent="submit">
                                <input class="flip-card__input" placeholder="Name" type="text"
                                    v-model="credentials.name" required>
                                <input class="flip-card__input" name="username" placeholder="Username" type="text"
                                    v-model="credentials.username" required>
                                <input class="flip-card__input" name="password" placeholder="Password" type="password"
                                    v-model="credentials.password" required>
                                <input class="flip-card__input" name="passwordConfirm" placeholder="Confirm password"
                                    type="password" v-model="passwordConfirm" required>
                                <button type="submit" class="flip-card__btn">Confirm!</button>
                            </form>
                        </div>
                    </div>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
import loginService from '../services/login';

export default {
    name: 'LogInForm',
    data() {
        return {
            isSignUp: false,
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
                if (this.credentials.password !== this.passwordConfirm) {
                    this.errorMessage = 'Passwords do not match.';
                    return;
                }
                try {
                    const response = await loginService.signUp(this.credentials);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('username', response.username);
                    this.$router.push('/cookbook').then(() => window.location.reload());
                } catch (error) {
                    this.errorMessage = 'Failed to sign up. Please check your input.';
                    console.error('Signup failed', error);
                }
            } else {
                try {
                    const response = await loginService.login(this.credentials);
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('username', response.username);
                    this.$router.push('/cookbook').then(() => window.location.reload());
                } catch (error) {
                    this.errorMessage = 'Failed to login. Please check your credentials.';
                    console.error('Login failed', error);
                }
            }
        }
    }
}
</script>


<style>
.login_form {
    min-height: 600px;
    width: 100%;
}

.wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
}

/* switch card */
.switch {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 100px;
    height: 20px;
}

.card-side {
    font-size: 20px;
    font-weight: bold;
    color: black;
}

.card-side::before {
    position: absolute;
    content: 'Log in';
    left: -100px;
    top: 0;
    width: 100px;
    text-decoration: underline;
}

.card-side::after {
    position: absolute;
    content: 'Sign up';
    left: 100px;
    top: 0;
    width: 100px;
    text-decoration: none;
}

.toggle {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    box-sizing: border-box;
    border-radius: 5px;
    border: 2px solid black;
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--lightBlue);
    transition: 0.3s;
}

.slider:before {
    box-sizing: border-box;
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    border: 2px solid black;
    border-radius: 5px;
    left: -2px;
    bottom: 0px;
    background-color: white;
    transition: 0.3s;
}

.toggle:checked+.slider {
    background-color: var(--blue);
}

.toggle:checked+.slider:before {
    transform: translateX(80px);
}

.toggle:checked~.card-side:before {
    text-decoration: none;
}

.toggle:checked~.card-side:after {
    text-decoration: underline;
}

/* card */

.flip-card__inner {
    width: 318px;
    height: 350px;
    position: relative;
    background-color: transparent;
    perspective: 1000px;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
}

.toggle:checked~.flip-card__inner {
    transform: rotateY(180deg);
}

.toggle:checked~.flip-card__front {
    box-shadow: none;
}

.flip-card__front,
.flip-card__back {
    padding: 20px;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    background: lightgrey;
    gap: 20px;
    border-radius: 5px;
    border: 2px solid black;
}

.flip-card__back {
    transform: rotateY(180deg);
}

.flip-card__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.title {
    margin: 20px 0 20px 0;
    font-size: 30px;
    font-weight: 900;
    text-align: center;
    color: black;
}

.flip-card__input {
    width: 250px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid black;
    background-color: white;
    font-size: 15px;
    font-weight: 600;
    color: black;
    padding: 5px 10px;
    outline: none;
}

.flip-card__input::placeholder {
    color: black;
    opacity: 0.8;
}

.flip-card__input:focus {
    border: 2px solid black;
}

.flip-card__btn:active,
.button-confirm:active {
    transform: translate(3px, 3px);
}

.flip-card__btn {
    margin: 20px 0 20px 0;
    width: 120px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid black;
    background-color: white;
    font-size: 17px;
    font-weight: 600;
    color: black;
    cursor: pointer;
}
</style>