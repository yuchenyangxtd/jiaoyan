<template>
  <div>
    <el-button link style="margin-bottom:16px" @click="$router.back()">← 返回</el-button>
    <el-card>
      <h2 style="margin-bottom:16px">提交教研材料</h2>
      <el-form :model="form" label-width="80px">
        <el-form-item label="材料名称">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.description" type="textarea" :rows="10" placeholder="在此输入材料内容..." />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { submitMaterial } from '../../api/material'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const form = reactive({ title: '', description: '' })

async function handleSubmit() {
  await submitMaterial({ ...form, submitter_id: userStore.user!.id })
  ElMessage.success('材料提交成功')
  router.push('/materials')
}
</script>
