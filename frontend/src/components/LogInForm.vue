<template>
    <div class="login_form">
        <form id="form">
            <div class="form-group">
                <label for="username">Username:</label>
                <input type="text" id="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password:</label>
                <textarea id="password" required></textarea>
            </div>
            <button type="submit">Log in</button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'LogInForm'
}
</script>