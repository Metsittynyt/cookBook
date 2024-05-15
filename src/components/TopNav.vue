<template>
  <div class="topnav">
    <div class="topnavLogo">
      <img :src="require('@/assets/photos/cookhat.png')" alt="Logo" id="Logo">
    </div>
    <div class="topnavLinks">
      <router-link to="/cookbook" class="nav-item" active-class="active">My recipes</router-link>
      <router-link to="/" exact class="nav-item" active-class="active">CookBook</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TopNav'
}
</script>
