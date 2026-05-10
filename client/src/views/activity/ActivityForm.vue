<template>
  <div>
    <el-button link style="margin-bottom:16px" @click="$router.back()">← 返回</el-button>
    <el-card>
      <h2 style="margin-bottom:16px">创建教研活动</h2>
      <el-form :model="form" label-width="80px">
        <el-form-item label="活动名称">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="活动类型">
          <el-select v-model="form.type">
            <el-option label="集体备课" value="group_prep" />
            <el-option label="公开课" value="open_class" />
            <el-option label="听评课" value="lesson_eval" />
            <el-option label="教学研讨" value="seminar" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="地点">
          <el-input v-model="form.location" />
        </el-form-item>
        <el-form-item label="活动日期">
          <el-date-picker v-model="form.date" type="date" placeholder="选择日期" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" :rows="6" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCreate">创建</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { createActivity } from '../../api/activity'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const form = reactive({
  title: '', type: 'group_prep', location: '',
  date: null as string | null, description: '', status: 'pending',
})

async function handleCreate() {
  await createActivity({ ...form, created_by: userStore.user!.id })
  ElMessage.success('活动创建成功')
  router.push('/activities')
}
</script>
