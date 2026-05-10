<template>
  <div>
    <el-button link style="margin-bottom:16px" @click="$router.back()">← 返回</el-button>
    <el-card>
      <h2 style="margin-bottom:16px">发布通知</h2>
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="置顶">
          <el-switch v-model="form.is_pinned" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="form.content" type="textarea" :rows="8" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleCreate">发布</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user'
import { createNotice } from '../../api/notice'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const form = reactive({ title: '', content: '', is_pinned: false })

async function handleCreate() {
  await createNotice({ ...form, created_by: userStore.user!.id })
  ElMessage.success('通知发布成功')
  router.push('/notices')
}
</script>
