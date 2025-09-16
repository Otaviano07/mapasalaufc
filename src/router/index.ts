import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Local from '../views/Local.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/local/:bloco/:sala',
    name: 'Local',
    component: Local,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
