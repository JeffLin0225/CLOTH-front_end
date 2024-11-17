import { createRouter, createWebHistory } from 'vue-router'

import Home from '../index/Home.vue';
import NotFound from '../index/NotFound.vue';
import routerPages from '../views/pages/router-pages.js';
import routerSecure from '../views/secure/router-secure';
import routerActivity from '../views/activityPage/router-Activity.js';

import Login from '../views/secure/Login.vue';

const routes = [
    { name: "home-link", path: "/", component: Home },
    { name: "notfound-link", path: "/:pathMatch(.*)*", component: NotFound },
    { name: "Login-link", path: "/login", component: Login },


    ...routerPages,
    ...routerSecure,
    ...routerActivity,
];

const router = createRouter({
    routes: routes,
    history: createWebHistory(),
});

export default router
