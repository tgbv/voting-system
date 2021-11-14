import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: {
      name: "PersonalInfo",
    },
  },

  {
    path: "/personal-info",
    name: "PersonalInfo",
    component: () =>
      import(/* webpackChunkName: "pinfo" */ "../views/PersonalInfo.vue"),
  },

  {
    path: "/submit-vote",
    name: "SubmitVote",
    component: () =>
      import(/* webpackChunkName: "sv" */ "../views/SubmitVote.vue"),

    beforeEnter(to, from, next) {
      if (store.state.mnemonic) {
        return next();
      }

      next({ name: "PersonalInfo" });
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
