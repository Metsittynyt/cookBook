import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import RecipePage from '../pages/RecipePage.vue';
import CookBookPage from '../pages/CookBookPage.vue';
import UserPage from '../pages/UserPage.vue';
import CreateEditPage from '@/pages/CreateEditPage.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage, name: 'HomePage', meta: { bannerClass: 'home-banner' } },
    { path: '/:id', component: RecipePage, name: 'RecipePage', props: true, meta: { bannerClass: 'recipe-banner' } },
    { path: '/cookbook', component: CookBookPage, name: 'CookBookPage', meta: { bannerClass: 'cookbook-banner' } },
    { path: '/user', component: UserPage, name: 'UserPage', meta: { bannerClass: 'user-banner' } },
    { path: '/create', component: CreateEditPage, name: 'CreateRecipePage', meta: { bannerClass: 'create-banner' } },
    { path: '/edit/:id', component: CreateEditPage, name: 'EditRecipePage', props: true, meta: { bannerClass: 'edit-banner' } }
    // other routes
  ],
});

export default router;
