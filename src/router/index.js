import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import CookBookPage from '../pages/CookBookPage.vue';
import CreatePage from '../pages/CreatePage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage, name: 'HomePage' },
    { path: '/cookbook', component: CookBookPage, name: 'CookBookPage' },
    { path: '/create', component: CreatePage, name: 'CreatePage' }
    // other routes
  ],
});

export default router;
