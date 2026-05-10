<template>
  <div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h2>教研计划</h2>
      <el-button type="primary" @click="showCreate = true" v-if="userStore.user?.role === 'admin' || userStore.user?.role === 'group_leader'">
        发布计划
      </el-button>
    </div>

    <el-table :data="plans" stripe style="width:100%">
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="semester" label="学期" width="140" />
      <el-table-column prop="department" label="适用专业部" width="140" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'published' ? 'success' : row.status === 'draft' ? 'info' : 'warning'">
            {{ row.status === 'published' ? '已发布' : row.status === 'draft' ? '草稿' : '已归档' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" @click="viewPlan(row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="showCreate" title="发布教研计划" width="600px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="学期">
          <el-input v-model="form.semester" placeholder="如 2025-2026-1" />
        </el-form-item>
        <el-form-item label="适用专业部">
          <el-input v-model="form.department" placeholder="留空表示全校" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="6" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreate = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { getPlans, createPlan } from '../../api/plan'
import type { Plan } from '../../types'

const userStore = useUserStore()
const router = useRouter()
const plans = ref<Plan[]>([])
const showCreate = ref(false)
const form = ref({ title: '', semester: '', department: '', content: '' })

onMounted(async () => {
  plans.value = await getPlans()
})

function viewPlan(id: number) {
  router.push(`/plans/${id}`)
}

async function handleCreate() {
  await createPlan({ ...form.value, status: 'published', created_by: userStore.user!.id })
  showCreate.value = false
  plans.value = await getPlans()
  form.value = { title: '', semester: '', department: '', content: '' }
}
</script>
