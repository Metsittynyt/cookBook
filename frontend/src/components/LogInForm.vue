<template>
    <ErrorMessage :message="errorMessage" />
    <div class="login-form">
        <label class="switch">
            <input class="toggle" type="checkbox" @change="toggleFlip">
            <span class="slider"></span>
            <span class="card-side"></span>
        </label>
        <div class="flip-card">
            <div class="flip-card-inner" ref="flipCardInner">
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
                            v-model="credentials.username" required>
                        <input class="flip-card__input" name="password" placeholder="Password" type="password"
                            v-model="credentials.password" required>
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
import ErrorMessage from '../components/ErrorMessage.vue'

export default {
    name: 'LogInForm',
    components: {
        ErrorMessage
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
            errorMessage: ''
        };
    },
    methods: {
        toggleFlip(event) {
            const flipCardInner = this.$refs.flipCardInner;
            if (event.target.checked) {
                flipCardInner.classList.add('flipped');
            } else {
                flipCardInner.classList.remove('flipped');
            }
        },
        async submit() {
            if (this.isSignUp) {
                if (!this.validatePassword(this.credentials.password)) {
                    return;
                }
                if (this.credentials.password !== this.passwordConfirm) {
                    this.errorMessage = 'Passwords do not match.';
                    return;
                }
                try {
                    await loginService.signUp(this.credentials);
                    this.$router.push('/cookbook').then(() => window.location.reload());
                } catch (error) {
                    this.errorMessage = 'Failed to sign up. Please check your input.';
                    console.error('Signup failed', error);
                }
            } else {
                try {
                    await loginService.login(this.credentials);
                    this.$router.push('/cookbook').then(() => window.location.reload());
                } catch (error) {
                    this.errorMessage = 'Failed to login. Please check your credentials.';
                    console.error('Login failed', error);
                }
            }
        },
        validatePassword(password) {
            const minLength = 8;
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumbers = /[0-9]/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            if (password.length < minLength) {
                this.errorMessage = `Password must be at least ${minLength} characters long.`;
                return false;
            }
            if (!hasUpperCase) {
                this.errorMessage = 'Password must contain at least one uppercase letter.';
                return false;
            }
            if (!hasLowerCase) {
                this.errorMessage = 'Password must contain at least one lowercase letter.';
                return false;
            }
            if (!hasNumbers) {
                this.errorMessage = 'Password must contain at least one number.';
                return false;
            }
            if (!hasSpecialChar) {
                this.errorMessage = 'Password must contain at least one special character.';
                return false;
            }
            return true;
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
    gap: 30px;
}

.switch {
    --input-focus: #2d8cf0;
    --font-color: #323232;
    --font-color-sub: #666;
    --bg-color: #fff;
    --bg-color-alt: #666;
    --main-color: #323232;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 100px;
    height: 20px;
    margin: auto;
}

.toggle {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    box-sizing: border-box;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg-colorcolor);
    transition: 0.3s;
}

.slider:before {
    box-sizing: border-box;
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    border: 2px solid var(--main-color);
    border-radius: 5px;
    left: -2px;
    bottom: 2px;
    background-color: var(--bg-color);
    box-shadow: 0 3px 0 var(--main-color);
    transition: 0.3s;
}

.toggle:checked+.slider {
    background-color: var(--input-focus);
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
    color: var(--font-color);
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
    margin: 20px auto;
}

.flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
}

.flip-card-inner.flipped {
    transform: rotateY(180deg);
}


.flip-card-front,
.flip-card-back {
    position: absolute;
    width: 100%;
    height: fit-content;
    background-color: #83C5BE;
    border: 2px solid #006d77;
    box-shadow: 4px 4px #006d77;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.flip-card-back {
    transform: rotateY(180deg);
}

.flip-card__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.flip-card__input {
    width: 250px;
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
</style>