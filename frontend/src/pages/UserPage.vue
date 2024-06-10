<template>
  <LogInForm v-if="!isLoggedIn" />

  <div v-else>
    <h1>Logged in as {{ username }}</h1>
    <button @click="logout" class="logout-button">Log out</button>
  </div>
</template>


<script>
import LogInForm from '../components/LogInForm'

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
      // Check if the user is logged in by checking for a token in local storage
      return !!localStorage.getItem('token');
    }
  },
  created() {
    // Optionally, retrieve the username from local storage if available
    this.username = localStorage.getItem('username') || 'User';
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username'); // Clear the username from local storage
      this.$router.push('/').then(() => {
        window.location.reload();
      });
    }
  }
}
</script>