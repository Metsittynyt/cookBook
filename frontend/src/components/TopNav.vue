<template>
  <div>
    <nav class="topnav">
      <div class="topnavLogo">
        <router-link to="/" exact active-class="active">
          <img :src="require('@/assets/photos/cookhat.png')" alt="Logo" id="Logo">
        </router-link>
      </div>
      <button class="navbar-toggler" type="button" @click="toggleSidebar" aria-label="Toggle navigation">
        <i class="fas fa-bars"></i>
      </button>
      <div class="topnavLinks">
        <router-link to="/" exact class="nav-item" active-class="active">CookBook</router-link>
        <router-link to="/cookbook" v-if="isLoggedIn" class="nav-item" active-class="active">My recipes</router-link>
        <router-link to="/user" class="nav-item" active-class="active">
          <i class="fas fa-user-alt" id="user_icon"></i>
        </router-link>
      </div>
    </nav>
    <div class="sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <button class="close-btn" @click="toggleSidebar">&times;</button>
      <div class="sidebar-content">
        <router-link to="/" exact class="nav-item" active-class="active" @click="toggleSidebar">CookBook</router-link>
        <router-link to="/cookbook" v-if="isLoggedIn" class="nav-item" active-class="active" @click="toggleSidebar">My
          recipes</router-link>
      </div>
      <div class="sidebar-footer">
        <router-link to="/user" class="nav-item user-link" active-class="active" @click="toggleSidebar">
          <i class="fas fa-user-alt" id="user_icon"></i>
        </router-link>
      </div>
    </div>
    <div class="overlay" v-if="isSidebarOpen" @click="toggleSidebar"></div>
  </div>
</template>

<script>

export default {
  name: 'TopNav',
  data() {
    return {
      isSidebarOpen: false
    };
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
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }
}
</script>

<style scoped>
.topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--green);
  padding: 10px;
  color: white;
}

.topnavLogo img {
  height: 40px;
}

.navbar-toggler {
  background: none;
  border: none;
  font-size: 24px;
  color: white;
}

.topnavLinks {
  display: none;
  gap: 20px;
}

.topnavLinks a.nav-item {
  padding: 10px;
}

.nav-item.active,
.nav-item:hover {
  background-color: var(--lightGreen);
  color: black;
  border-radius: 10px;
}

.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 250px;
  background-color: var(--green);
  padding: 10px;
  padding-top: 60px;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.sidebar-content,
.sidebar-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar-content {
  flex: 0.8;
}

.nav-item {
  font-size: 25px;
  margin: 10px;
  padding: 5px;
  text-decoration: none;
  color: white;
  white-space: nowrap;
}

.sidebar-open {
  transform: translateX(0);
}

.close-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 30px;
  background: none;
  border: none;
  color: white;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}


.topnavLogo {
  float: left;
  width: 50%;
}

#Logo {
  height: 80px;
  width: 80px;
  margin-left: 30px;
}

@media (min-width: 767px) {
  .topnavLinks {
    gap: 0px;
  }

  .navbar-toggler {
    display: none;
  }

  .topnavLinks {
    display: flex;
  }

  .sidebar {
    display: none;
  }

  .overlay {
    display: none;
  }
}
</style>