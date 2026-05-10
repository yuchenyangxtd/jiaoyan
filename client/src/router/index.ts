import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

const routes = [
  {
    path: '/login',
    component: () => import('../layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('../views/login/LoginPage.vue') },
    ],
  },
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: () => import('../views/dashboard/Dashboard.vue') },

      // 教研管理
      { path: 'plans', component: () => import('../views/plan/PlanList.vue') },
      { path: 'plans/:id', component: () => import('../views/plan/PlanDetail.vue') },
      { path: 'activities', component: () => import('../views/activity/ActivityList.vue') },
      { path: 'activities/create', component: () => import('../views/activity/ActivityForm.vue') },
      { path: 'activities/:id', component: () => import('../views/activity/ActivityDetail.vue') },
      { path: 'materials', component: () => import('../views/material/MaterialList.vue') },
      { path: 'materials/submit', component: () => import('../views/material/MaterialForm.vue') },
      { path: 'notices', component: () => import('../views/notice/NoticeList.vue') },
      { path: 'notices/create', component: () => import('../views/notice/NoticeForm.vue') },

      // 课题研究
      { path: 'topics', component: () => import('../views/topic/TopicList.vue') },

      // 教师竞赛
      { path: 'competitions', component: () => import('../views/competition/CompetitionList.vue') },

      // 学生技能赛
      { path: 'skill-contests', component: () => import('../views/skill-contest/SkillContestList.vue') },

      // 培训管理
      { path: 'trainings', component: () => import('../views/training/TrainingList.vue') },

      // 资源库
      { path: 'resources', component: () => import('../views/resource/ResourceList.vue') },

      // 统计分析
      { path: 'statistics', component: () => import('../views/statistics/StatisticsPage.vue') },

      // 系统管理
      { path: 'admin/users', component: () => import('../views/admin/UserList.vue') },
      { path: 'admin/roles', component: () => import('../views/admin/RoleList.vue') },

      { path: ':pathMatch(.*)*', component: () => import('../views/error/NotFound.vue') },
    ],
  },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    await userStore.init()
    if (!userStore.isLoggedIn) {
      next('/login')
      return
    }
  }
  next()
})

export default router
