<template>
  <div class="page">
    <h1>Log in</h1>
    <LogInForm />
  </div>
</template>

<script>
import LogInForm from '../components/LogInForm'

export default {
  name: 'UserPage',
  components: {
    LogInForm
  }
};
</script>