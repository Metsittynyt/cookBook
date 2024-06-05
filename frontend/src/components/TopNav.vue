<template>
  <div class="topnav">
    <div class="topnavLogo">
      <router-link to="/" exact active-class="active">
        <img :src="require('@/assets/photos/cookhat.png')" alt="Logo" id="Logo">
      </router-link>
    </div>
    <div class="topnavLinks">
      <router-link to="/user" class="nav-item" active-class="active">
        <i class="fas fa-user-alt" id="user_icon"></i>
      </router-link>
      <router-link to="/cookbook" v-if="isLoggedIn" class="nav-item" active-class="active">My recipes</router-link>
      <router-link to="/" exact class="nav-item" active-class="active">CookBook</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopNav',
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('token');
    }
  }
}
</script>
