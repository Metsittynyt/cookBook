import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import CookBookPage from '../pages/CookBookPage.vue';
import UserPage from '../pages/UserPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage, name: 'HomePage' },
    { path: '/cookbook', component: CookBookPage, name: 'CookBookPage' },
    { path: '/user', component: UserPage, name: 'UserPage' }
    // other routes
  ],
});

export default router;
