<template>
  <div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h2>教研活动</h2>
      <el-button type="primary" @click="$router.push('/activities/create')" v-if="userStore.user?.role === 'admin' || userStore.user?.role === 'group_leader'">
        创建活动
      </el-button>
    </div>

    <el-table :data="activities" stripe style="width:100%">
      <el-table-column prop="title" label="活动名称" />
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          {{ typeLabels[row.type] || row.type }}
        </template>
      </el-table-column>
      <el-table-column prop="location" label="地点" width="120" />
      <el-table-column label="时间" width="160">
        <template #default="{ row }">
          {{ row.date ? new Date(row.date).toLocaleString('zh-CN', {month:'long', day:'numeric'}) : '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusTypes[row.status]">
            {{ statusLabels[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" @click="$router.push(`/activities/${row.id}`)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import { getActivities } from '../../api/activity'
import type { Activity } from '../../types'

const userStore = useUserStore()
const activities = ref<Activity[]>([])

const typeLabels: Record<string, string> = {
  group_prep: '集体备课', open_class: '公开课',
  lesson_eval: '听评课', seminar: '教学研讨', other: '其他',
}
const statusTypes: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
  pending: 'info', ongoing: 'warning', completed: 'success', cancelled: 'danger',
}
const statusLabels: Record<string, string> = {
  pending: '待开始', ongoing: '进行中', completed: '已完成', cancelled: '已取消',
}

onMounted(async () => {
  activities.value = await getActivities()
})
</script>
