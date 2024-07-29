<template>
    <MessageComponent v-if="message" :messageObject="message" />
    <div class="login-form">
        <label class="switch">
            <input class="toggle" type="checkbox" @change="toggleFlip" v-model="isSignUp">
            <span class="slider"></span>
            <span class="card-side"></span>
        </label>
        <div class="flip-card" :style="{ height: flipCardHeight }">
            <div class="flip-card-inner" ref="flipCardInner">
                <div class="recipeTop"></div>
                <div class="flip-card-front">
                    <form class="flip-card__form" @submit.prevent="submit">
                        <h2>Log in</h2>
                        <input class="flip-card__input" name="username" placeholder="Username" type="text"
                            v-model="credentials.username" required>
                        <input class="flip-card__input" name="password" placeholder="Password" type="password"
                            v-model="credentials.password" required>
                        <button type="submit" class="flip-card__btn">Let`s go!</button>
                    </form>
                </div>
                <div class="flip-card-back">
                    <form class="flip-card__form" @submit.prevent="submit">
                        <h2>Sign up</h2>
                        <input class="flip-card__input" placeholder="Name" type="text" v-model="credentials.name"
                            required>
                        <input class="flip-card__input" name="username" placeholder="Username" type="text"
                            v-model="credentials.username" @blur="checkUsername" required>
                        <CredentialValidator :username="credentials.username" :type="'username'"
                            @username-validity="setUsernameValidity" />
                        <input class="flip-card__input" name="password" placeholder="Password" type="password"
                            v-model="credentials.password" required>
                        <CredentialValidator :password="credentials.password" :type="'password'"
                            @username-validity="setUsernameValidity" />
                        <input class="flip-card__input" name="passwordConfirm" placeholder="Confirm password"
                            type="password" v-model="passwordConfirm" required>
                        <button type="submit" class="flip-card__btn">Confirm!</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import loginService from '../services/login';
import userService from '../services/users'
import MessageComponent from '../components/MessageComponent.vue';
import CredentialValidator from '../components/CredentialValidator.vue';

export default {
    name: 'LogInForm',
    components: {
        MessageComponent,
        CredentialValidator
    },
    data() {
        return {
            isSignUp: false,
            credentials: {
                name: '',
                username: '',
                password: ''
            },
            passwordConfirm: '',
            message: null,
            messageType: null,
            usernameValid: null, // null = unchecked, true = valid, false = invalid
            flipCardHeight: '400px' // Default height for login
        };
    },
    mounted() {
        this.loadMessage();
    },
    methods: {
        setUsernameValidity(isValid) {
            this.usernameValid = isValid;
        },
        async handleSignUp() {
            if (!this.usernameValid) {
                this.setMessage('Invalid username.', 'error');
                return;
            }
            if (this.credentials.password !== this.passwordConfirm) {
                this.setMessage('Passwords do not match.', 'error');
                return;
            }
            try {
                await userService.signUp(this.credentials);
                localStorage.setItem('signupMessage', JSON.stringify({
                    text: 'Sign up successful. Log into your new account.',
                    type: 'success'
                }));
                window.location.reload();
            } catch (error) {
                this.setMessage('Failed to sign up. Please check your input.', 'error');
                console.error('Signup failed', error);
            }
        },
        async handleLogin() {
            try {
                await loginService.login(this.credentials);
                this.$router.push('/cookbook').then(() => window.location.reload());
            } catch (error) {
                this.setMessage('Failed to login. Please check your credentials.', 'error');
                console.error('Login failed', error);
            }
        },
        loadMessage() {
            const message = localStorage.getItem('signupMessage');
            if (message) {
                const messageObj = JSON.parse(message);
                this.setMessage(messageObj.text, messageObj.type);
                localStorage.removeItem('signupMessage');
            }
        },
        setMessage(messageText, type) {
            this.message = {
                text: messageText,
                type: type
            };
            setTimeout(() => {
                this.clearMessage();
            }, 5000);
        },
        clearMessage() {
            this.message = null;
        },
        toggleFlip(event) {
            const flipCardInner = this.$refs.flipCardInner;
            if (event.target.checked) {
                flipCardInner.classList.add('flipped');
                this.isSignUp = true;
                this.flipCardHeight = '550px';
            } else {
                flipCardInner.classList.remove('flipped');
                this.isSignUp = false;
                this.flipCardHeight = '400px';
            }
        },
        async submit() {
            if (this.isSignUp) {
                await this.handleSignUp();
            } else {
                await this.handleLogin();
            }
        }
    }
}
</script>

<style>
.login-form {
    min-width: 250px;
    max-width: 500px;
    margin: 50px auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.switch {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 100px;
    height: 20px;
    margin: 0px auto 30px auto;
}

.toggle {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    box-sizing: border-box;
    border-radius: 5px;
    border: 2px solid #006d77;
    box-shadow: 4px 4px #006d77;
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: white;
    transition: 0.3s;
}

.slider:before {
    box-sizing: border-box;
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    border: 2px solid #E29578;
    border-radius: 5px;
    left: -2px;
    bottom: 1px;
    background-color: #FFDDD2;
    transition: 0.3s;
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

.card-side {
    font-size: larger;
    font-weight: 600;
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

.flip-card {
    display: flex;
    background-color: transparent;
    width: 100%;
    height: 400px;
    perspective: 1000px;
    margin: 0px -1px 0px -1px;
    box-sizing: border-box;
    transition: height 0.3s ease-in-out;
}

.flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
    box-sizing: border-box;
}

.flip-card-inner.flipped {
    transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
    position: absolute;
    width: calc(100% + 1px);
    background: white;
    background-image: linear-gradient(90deg,
            transparent 30px,
            #E29578 30px,
            #E29578 32px,
            transparent 32px),
        linear-gradient(#EDF6F9 0.1em, transparent 0.1em);
    background-size: 100% 30px;
    border: 1px solid #006d77;
    border-top: none;
    box-shadow: 4px 4px #83C5BE;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
    box-sizing: border-box;
}

.flip-card-front {
    padding: 30px 10px 30px 30px;
}

.flip-card-back {
    transform: rotateY(180deg);
    padding: 10px 10px 10px 30px;
}

.flip-card-front .flip-card__form {
    gap: 40px;
}

.flip-card-back .flip-card__form {
    gap: 5px;
}

.flip-card__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.flip-card__form h2 {
    margin: 0px;
}

.flip-card__input {
    width: 200px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid #006d77;
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
    box-shadow: none;
}

.fa-check::before,
.fa-times::before {
    margin-left: 10px
}
</style>