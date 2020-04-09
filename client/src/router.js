import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Login from './views/Login.vue';
import Register from './views/Register.vue';

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/home',
      component: Home
    },
    {
      path: '/login/:type',
      name: 'login',
      component: Login
    },
    {
      path: '/register/:type',
      name: 'register',
      component: Register
    },
    {
      path: '/orders',
      name: 'orders',
      // lazy-loaded
      component: () => import('./views/OrdersList.vue')
    },
    {
      path: '/driver/:id',
      name: 'driver',
      // lazy-loaded
      component: () => import('./views/ProfileEdit.vue')
    },
    {
      path: '/customer/:id',
      name: 'customer',
      // lazy-loaded
      component: () => import('./views/ProfileEdit.vue')
    }
  ]
});

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/login', '/register', '/home'];
//   const authRequired = !publicPages.includes(to.path);
//   const loggedIn = localStorage.getItem('user');

//   // trying to access a restricted page + not logged in
//   // redirect to login page
//   if (authRequired && !loggedIn) {
//     next('/login');
//   } else {
//     next();
//   }
// });
