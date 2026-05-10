<template>
  <div v-if="activity">
    <el-button link style="margin-bottom:16px" @click="$router.back()">← 返回列表</el-button>
    <el-card>
      <h2>{{ activity.title }}</h2>
      <p style="color:#999; font-size:13px; margin:8px 0;">
        {{ activityTypeLabel }} ·
        {{ activity.location || '未指定地点' }} ·
        {{ activity.date ? new Date(activity.date).toLocaleString('zh-CN', {month:'long', day:'numeric'}) : '' }}
      </p>
      <el-divider />
      <div style="white-space:pre-wrap;">{{ activity.description }}</div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getActivity } from '../../api/activity'
import type { Activity } from '../../types'

const route = useRoute()
const activity = ref<Activity | null>(null)

const typeLabels: Record<string, string> = {
  group_prep: '集体备课', open_class: '公开课',
  lesson_eval: '听评课', seminar: '教学研讨', other: '其他',
}
const activityTypeLabel = computed(() => {
  return activity.value ? (typeLabels[activity.value.type ?? ''] ?? '') : ''
})

onMounted(async () => {
  activity.value = await getActivity(Number(route.params.id))
})
</script>
