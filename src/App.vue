<template>
  <div>
    <TopNav />
    <router-view/>
    <BottomFooter />
  </div>
</template>

<script>
import TopNav from './components/TopNav.vue'
import BottomFooter from './components/BottomFooter.vue'

export default {
  name: 'App',
  components: {
    TopNav,
    BottomFooter
  }
}
</script>
