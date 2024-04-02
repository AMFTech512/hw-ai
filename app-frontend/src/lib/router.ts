import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import NotFound from "../pages/404.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/problems",
  },
  {
    path: "/problems",
    component: () => import("../pages/ProblemList.vue"),
  },
  {
    path: "/problems/:id/edit",
    component: () => import("../pages/ProblemEdit.vue"),
  },
  {
    path: "/problems/:id/submit",
    component: () => import("../pages/ProblemSubmit.vue"),
  },
  {
    path: "/problems/:problemId/submissions/:submissionId",
    component: () => import("../pages/SubmissionView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
