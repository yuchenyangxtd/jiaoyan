<template>
  <div>
    <div class="page-header">
      <el-button type="primary" @click="openDialog()">新建培训</el-button>
    </div>
    <el-table :data="list" v-loading="loading" stripe>
      <el-table-column prop="title" label="培训名称" min-width="200" />
      <el-table-column prop="location" label="地点" width="150" />
      <el-table-column prop="start_date" label="开始日期" width="120" />
      <el-table-column prop="end_date" label="结束日期" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)">{{ statusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button text type="primary" @click="openDialog(row)">编辑</el-button>
          <el-button text type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑培训' : '新建培训'" width="600px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="培训名称" prop="title" :rules="[{ required: true, message: '请输入培训名称' }]">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="培训说明" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="培训地点" prop="location">
          <el-input v-model="form.location" />
        </el-form-item>
        <el-form-item label="开始日期" prop="start_date">
          <el-date-picker v-model="form.start_date" type="date" style="width:100%" />
        </el-form-item>
        <el-form-item label="结束日期" prop="end_date">
          <el-date-picker v-model="form.end_date" type="date" style="width:100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" style="width:100%">
            <el-option label="计划中" value="planned" />
            <el-option label="进行中" value="ongoing" />
            <el-option label="已结束" value="ended" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { trainingApi } from '../../api/training'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Training } from '../../types'

const list = ref<Training[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formRef = ref<any>(null)
const form = ref<any>({ title: '', description: '', location: '', start_date: '', end_date: '', status: 'planned' })

async function fetchData() {
  loading.value = true
  try { list.value = await trainingApi.list() } finally { loading.value = false }
}
function openDialog(row?: any) {
  editingId.value = row?.id ?? null
  form.value = row ? { ...row } : { title: '', description: '', location: '', start_date: '', end_date: '', status: 'planned' }
  dialogVisible.value = true
}
async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (editingId.value) {
      await trainingApi.update(editingId.value, form.value)
      ElMessage.success('更新成功')
    } else {
      await trainingApi.create(form.value)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    await fetchData()
  } finally { saving.value = false }
}
async function handleDelete(id: number) {
  await ElMessageBox.confirm('确定删除吗？', '确认')
  await trainingApi.delete(id)
  ElMessage.success('删除成功')
  await fetchData()
}
function statusLabel(s: string) { const m: Record<string, string> = { planned: '计划中', ongoing: '进行中', ended: '已结束' }; return m[s] || s }
function statusType(s: string) { const m: Record<string, 'success' | 'warning' | 'info'> = { planned: 'info', ongoing: 'warning', ended: 'success' }; return m[s] || 'info' }
onMounted(fetchData)
</script>
