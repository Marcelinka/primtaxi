import orderComponent from "../components/orderComponent";
import ordersComponent from "../components/ordersComponent";
import loginComponent from "../components/loginComponent";

const routes = [
  { path: '/login', component: loginComponent },
  { path: '/orders', component: ordersComponent },
  { path: '/orders/:id', component: orderComponent }
];

const router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
  let id = window.sessionStorage.getItem('id');
  if(to.path == '/login' && id && id != 'undefined') {
    next('/orders');
  } else if(to.path != '/login' && (!id || id == 'undefined')) {
    next('/login');
  } else if(to.path == '/') {
    next('/orders');
  } else {
    next();
  }
});

export default router;