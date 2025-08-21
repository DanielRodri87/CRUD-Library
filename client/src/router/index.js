import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";
import Home from "../views/Home.vue";
import cadastro from "../views/Cadastro.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/signup", component: Signup },
  { path: "/home", component: Home },
  { path: "/cadastro", component: cadastro },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
