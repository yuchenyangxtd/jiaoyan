<template>
  <div>
    <el-card shadow="never" class="search-bar">
      <div style="display:flex; align-items:center; gap:12px">
        <el-icon style="font-size:20px; color:var(--el-color-primary)"><InfoFilled /></el-icon>
        <span style="color:#666;font-size:14px">角色与权限说明 — 当前系统共 4 种角色，权限在代码层控制，不可在线修改。</span>
      </div>
    </el-card>

    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="12" v-for="role in roles" :key="role.id" style="margin-bottom:20px">
        <el-card shadow="hover" class="role-card">
          <template #header>
            <div class="role-header">
              <div class="role-title">
                <el-tag :type="role.tagType" size="large" effect="dark" class="role-badge">{{ role.name }}</el-tag>
              </div>
              <div class="role-desc">{{ role.description }}</div>
            </div>
          </template>
          <div class="perm-section">
            <div class="perm-title">可访问模块</div>
            <div class="perm-tags">
              <el-tag v-for="p in role.permissions" :key="p" size="small" class="perm-tag">
                <el-icon style="margin-right:4px"><Check /></el-icon>{{ p }}
              </el-tag>
            </div>
          </div>
          <el-divider style="margin:12px 0" />
          <div class="perm-section">
            <div class="perm-title">典型职责</div>
            <ul class="duty-list">
              <li v-for="d in role.duties" :key="d">{{ d }}</li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { InfoFilled, Check } from '@element-plus/icons-vue'

interface RoleInfo {
  id: string
  name: string
  tagType: 'success' | 'warning' | 'danger' | 'info'
  description: string
  permissions: string[]
  duties: string[]
}

const roles: RoleInfo[] = [
  {
    id: 'admin',
    name: '管理员',
    tagType: 'danger',
    description: '拥有系统全部权限，可管理所有模块和用户',
    permissions: ['用户管理', '角色管理', '教研管理', '课题研究', '教师竞赛', '学生技能赛', '培训管理', '资源库', '统计分析'],
    duties: ['系统维护与配置', '用户账号管理', '全校数据查看', '流程审批'],
  },
  {
    id: 'leader',
    name: '领导',
    tagType: 'success',
    description: '可查看全校教研数据，监督教学质量',
    permissions: ['统计分析', '教研管理（只读）', '课题研究（只读）', '教师竞赛（只读）', '学生技能赛（只读）', '资源库（只读）'],
    duties: ['查看全校教研数据看板', '查阅教研计划和总结', '监督教学研究质量'],
  },
  {
    id: 'group_leader',
    name: '教研组长',
    tagType: 'warning',
    description: '管理本组教研工作，审核组员材料',
    permissions: ['教研管理', '课题研究', '教师竞赛', '培训管理', '资源库'],
    duties: ['组织和发布教研活动', '审核组员提交的材料', '制定教研计划', '上传下达通知公告'],
  },
  {
    id: 'teacher',
    name: '教师',
    tagType: 'info',
    description: '参与教研活动，提交材料，查看通知',
    permissions: ['教研计划（查看）', '教研活动（参与）', '材料提交', '课题研究', '教师竞赛（查看）', '培训管理（查看）', '资源库'],
    duties: ['参与教研活动和听课评课', '提交教学材料', '申报课题和参赛', '查看通知公告'],
  },
]
</script>

<style scoped>
.search-bar {
  border-radius: 8px;
}
.role-card {
  border-radius: 10px;
  height: 100%;
}
.role-card :deep(.el-card__body) {
  padding: 8px 20px 20px;
}
.role-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.role-title {
  display: flex;
  align-items: center;
  gap: 12px;
}
.role-badge {
  font-size: 16px;
  font-weight: 600;
  padding: 6px 16px;
}
.role-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
}
.perm-section {
  margin-top: 4px;
}
.perm-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}
.perm-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.perm-tag {
  display: flex;
  align-items: center;
  font-size: 12px;
}
.duty-list {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: #555;
  line-height: 1.8;
}
</style>
