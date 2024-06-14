<template>
  <LogInForm v-if="!isLoggedIn" />

  <div v-else>
    <h1>Logged in as {{ username }}</h1>
    <button @click="logout" class="logout-button">Log out</button>
  </div>
</template>


<script>
import LogInForm from '../components/LogInForm'
import loginService from '@/services/login'

export default {
  name: 'UserPage',
  components: {
    LogInForm
  },
  data() {
    return {
      username: ''
    }
  },
  computed: {
    isLoggedIn() {
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };

      return !!getCookie('auth_token');
    }
  },
  created() {
    this.getName()
  },
  methods: {
    async getName() {
      if (this.isLoggedIn) {
        this.username = await loginService.getUsername()
      }
    },
    async logout() {
      const result = await loginService.logout();
      console.log(result);
      this.$router.push('/').then(() => {
        window.location.reload();
      });
    }
  }
}
</script>