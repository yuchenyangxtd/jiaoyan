<template>
  <div class="main-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <span class="logo-icon">◆</span>
          <span class="logo-text">安新职教</span>
        </div>
      </div>
      <el-menu
        :default-active="route.path"
        router
        class="sidebar-menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><HomeFilled /></el-icon>
          <span>工作台</span>
        </el-menu-item>

        <el-sub-menu index="jiaoyan">
          <template #title>
            <el-icon><Notebook /></el-icon>
            <span>教研管理</span>
          </template>
          <el-menu-item index="/plans">教研计划</el-menu-item>
          <el-menu-item index="/activities">教研活动</el-menu-item>
          <el-menu-item index="/materials">材料提交</el-menu-item>
          <el-menu-item index="/notices">通知公告</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/topics">
          <el-icon><Coin /></el-icon>
          <span>课题研究</span>
        </el-menu-item>
        <el-menu-item index="/competitions">
          <el-icon><Trophy /></el-icon>
          <span>教师竞赛</span>
        </el-menu-item>
        <el-menu-item index="/skill-contests">
          <el-icon><Medal /></el-icon>
          <span>学生技能赛</span>
        </el-menu-item>
        <el-menu-item index="/trainings">
          <el-icon><Reading /></el-icon>
          <span>培训管理</span>
        </el-menu-item>
        <el-menu-item index="/resources">
          <el-icon><FolderOpened /></el-icon>
          <span>资源库</span>
        </el-menu-item>
        <el-menu-item index="/statistics">
          <el-icon><DataAnalysis /></el-icon>
          <span>统计分析</span>
        </el-menu-item>

        <el-sub-menu index="admin" v-if="userStore.user?.role === 'admin' || userStore.user?.role === 'leader'">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="/admin/users">用户管理</el-menu-item>
          <el-menu-item index="/admin/roles">角色管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
      <div class="sidebar-footer">
        <span class="sidebar-slogan">白洋畔 · 育匠心</span>
      </div>
    </aside>

    <!-- Main -->
    <div class="main-area">
      <!-- Top Bar -->
      <header class="topbar">
        <div class="topbar-left">
          <h2 class="page-title">{{ pageTitle }}</h2>
        </div>
        <div class="topbar-right">
          <el-dropdown placement="bottom-end">
            <div class="user-avatar">
              <div class="avatar-circle">{{ userStore.user?.real_name?.charAt(0) || '师' }}</div>
              <div class="user-info">
                <span class="user-name">{{ userStore.user?.real_name }}</span>
                <span class="user-role">{{ roleLabel }}</span>
              </div>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- Content -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import {
  HomeFilled, Notebook, Coin, Trophy, Medal, Reading,
  FolderOpened, DataAnalysis, Setting, ArrowDown, SwitchButton
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const roleLabel = computed(() => {
  const map: Record<string, string> = {
    teacher: '教师',
    group_leader: '教研组长',
    admin: '管理员',
    leader: '领导',
  }
  return map[userStore.user?.role || ''] || ''
})

const pageTitle = computed(() => {
  const map: Record<string, string> = {
    '/dashboard': '工作台',
    '/plans': '教研计划',
    '/activities': '教研活动',
    '/materials': '材料提交',
    '/notices': '通知公告',
    '/topics': '课题研究',
    '/competitions': '教师竞赛',
    '/skill-contests': '学生技能赛',
    '/trainings': '培训管理',
    '/resources': '资源库',
    '/statistics': '统计分析',
    '/admin/users': '用户管理',
    '/admin/roles': '角色管理',
  }
  return map[route.path] || '安职教研管理系统'
})

async function handleLogout() {
  await userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  background: var(--color-bg);
}

/* Sidebar */
.sidebar {
  width: 240px;
  min-width: 240px;
  background: #fff;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.sidebar-header {
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--color-border);
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 22px;
  color: var(--color-primary);
  line-height: 1;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: 1px;
}

.sidebar-menu {
  flex: 1;
  border: none;
  padding: 8px;
}

.sidebar-menu :deep(.el-menu-item) {
  border-radius: 8px;
  margin: 2px 0;
  height: 44px;
  line-height: 44px;
  color: var(--color-text-secondary);
  font-size: 14px;
  transition: all 0.15s;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background: var(--color-primary-bg);
  color: var(--color-primary);
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background: var(--color-primary-bg);
  color: var(--color-primary);
  font-weight: 600;
  position: relative;
}

.sidebar-menu :deep(.el-menu-item.is-active::before) {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: var(--color-primary);
  border-radius: 0 3px 3px 0;
}

.sidebar-menu :deep(.el-sub-menu__title) {
  border-radius: 8px;
  height: 44px;
  line-height: 44px;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background: var(--color-primary-bg);
  color: var(--color-primary);
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
}

.sidebar-slogan {
  font-size: 12px;
  color: #94A3B8;
  letter-spacing: 2px;
}

/* Main Area */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.topbar {
  height: 64px;
  min-height: 64px;
  background: #fff;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text);
}

.topbar-right {
  display: flex;
  align-items: center;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 12px 4px 4px;
  border-radius: 8px;
  transition: background 0.15s;
}

.user-avatar:hover {
  background: var(--color-primary-bg);
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.user-role {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.dropdown-icon {
  color: #94A3B8;
  font-size: 14px;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
}
</style>
