<template>
  <div v-if="plan">
    <el-button link style="margin-bottom:16px" @click="router.back()">← 返回列表</el-button>
    <el-card>
      <h2>{{ plan.title }}</h2>
      <p style="color:#999; font-size:13px; margin:8px 0;">
        {{ plan.semester }} · {{ plan.department || '全校' }} ·
        <el-tag size="small" :type="plan.status === 'published' ? 'success' : 'info'">
          {{ plan.status === 'published' ? '已发布' : '草稿' }}
        </el-tag>
      </p>
      <el-divider />
      <div style="white-space:pre-wrap;">{{ plan.content }}</div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPlan } from '../../api/plan'
import type { Plan } from '../../types'

const route = useRoute()
const router = useRouter()
const plan = ref<Plan | null>(null)

onMounted(async () => {
  plan.value = await getPlan(Number(route.params.id))
})
</script>
