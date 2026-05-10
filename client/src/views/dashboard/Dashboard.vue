<template>
  <div class="dashboard">
    <!-- Welcome Banner -->
    <div class="welcome-banner">
      <div class="welcome-text">
        <h2>早上好，{{ userStore.user?.real_name || '老师' }}</h2>
        <p>{{ today }} · 欢迎回到安新职教中心教研系统</p>
      </div>
      <div class="banner-icon">
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
          <path d="M10 50 L40 8 L70 50 Z" fill="rgba(255,255,255,0.08)"/>
          <path d="M20 50 L40 18 L60 50 Z" fill="rgba(255,255,255,0.06)"/>
          <path d="M30 50 L40 30 L50 50 Z" fill="rgba(255,255,255,0.04)"/>
          <circle cx="40" cy="20" r="6" fill="rgba(255,255,255,0.15)"/>
        </svg>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card" style="--card-color: #0D9488;">
        <div class="stat-icon" style="background: rgba(13,148,136,0.1);">
          <el-icon :size="22" color="#0D9488"><Folder /></el-icon>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ stats.pendingReview }}</span>
          <span class="stat-label">待审核材料</span>
        </div>
      </div>
      <div class="stat-card" style="--card-color: #3B82F6;">
        <div class="stat-icon" style="background: rgba(59,130,246,0.1);">
          <el-icon :size="22" color="#3B82F6"><Calendar /></el-icon>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ stats.monthlyActivities }}</span>
          <span class="stat-label">本月活动</span>
        </div>
      </div>
      <div class="stat-card" style="--card-color: #F59E0B;">
        <div class="stat-icon" style="background: rgba(245,158,11,0.1);">
          <el-icon :size="22" color="#F59E0B"><Bell /></el-icon>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ stats.unreadNotices }}</span>
          <span class="stat-label">未读通知</span>
        </div>
      </div>
      <div class="stat-card" style="--card-color: #F472B6;">
        <div class="stat-icon" style="background: rgba(244,114,182,0.1);">
          <el-icon :size="22" color="#F472B6"><Document /></el-icon>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ stats.activeTopics }}</span>
          <span class="stat-label">进行中课题</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions & Recent Activity -->
    <div class="dashboard-grid">
      <div class="section-card">
        <h3 class="section-title">快捷操作</h3>
        <div class="quick-actions">
          <div class="action-item" @click="$router.push('/materials/submit')">
            <div class="action-icon" style="background: rgba(13,148,136,0.1);">
              <el-icon :size="20" color="#0D9488"><DocumentAdd /></el-icon>
            </div>
            <span>提交材料</span>
          </div>
          <div class="action-item" @click="$router.push('/activities/create')">
            <div class="action-icon" style="background: rgba(59,130,246,0.1);">
              <el-icon :size="20" color="#3B82F6"><Plus /></el-icon>
            </div>
            <span>创建活动</span>
          </div>
          <div class="action-item" @click="$router.push('/notices/create')">
            <div class="action-icon" style="background: rgba(245,158,11,0.1);">
              <el-icon :size="20" color="#F59E0B"><Edit /></el-icon>
            </div>
            <span>发布通知</span>
          </div>
          <div class="action-item" @click="$router.push('/plans')">
            <div class="action-icon" style="background: rgba(244,114,182,0.1);">
              <el-icon :size="20" color="#F472B6"><View /></el-icon>
            </div>
            <span>查看计划</span>
          </div>
        </div>
      </div>

      <div class="section-card">
        <h3 class="section-title">最近动态</h3>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-dot" style="background:#0D9488;"></div>
            <div class="activity-body">
              <p class="activity-text">数学组提交了本周教研计划</p>
              <p class="activity-time">10分钟前</p>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-dot" style="background:#3B82F6;"></div>
            <div class="activity-body">
              <p class="activity-text">公开课《数据结构》已创建</p>
              <p class="activity-time">1小时前</p>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-dot" style="background:#F59E0B;"></div>
            <div class="activity-body">
              <p class="activity-text">3份教研材料待你审核</p>
              <p class="activity-time">2小时前</p>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-dot" style="background:#F472B6;"></div>
            <div class="activity-body">
              <p class="activity-text">市级技能赛报名通知已发布</p>
              <p class="activity-time">昨天</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '../../stores/user'
import { Folder, Calendar, Bell, Document, DocumentAdd, Plus, Edit, View } from '@element-plus/icons-vue'

const userStore = useUserStore()

const today = computed(() => {
  const d = new Date()
  const weekdays = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 星期${weekdays[d.getDay()]}`
})

const stats = {
  pendingReview: 5,
  monthlyActivities: 3,
  unreadNotices: 2,
  activeTopics: 4,
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
}

/* Welcome Banner */
.welcome-banner {
  background: linear-gradient(135deg, #2563EB, #1D4ED8);
  border-radius: 16px;
  padding: 32px 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  color: #fff;
}

.welcome-text h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 6px;
}

.welcome-text p {
  font-size: 14px;
  opacity: 0.7;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  transition: all 0.2s;
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-body {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-secondary);
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.section-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 20px;
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid var(--color-border);
}

.action-item:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-bg);
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-item span {
  font-size: 14px;
  color: var(--color-text);
  font-weight: 500;
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 12px;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.activity-body {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  color: var(--color-text);
  margin-bottom: 2px;
}

.activity-time {
  font-size: 12px;
  color: #94A3B8;
}
</style>
