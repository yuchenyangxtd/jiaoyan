<template>
  <div>
    <div class="page-header">
      <el-button type="primary" @click="openDialog()">上传资源</el-button>
    </div>
    <el-table :data="list" v-loading="loading" stripe>
      <el-table-column prop="title" label="资源名称" min-width="200" />
      <el-table-column prop="type" label="类型" width="120" />
      <el-table-column prop="tags" label="标签" width="200">
        <template #default="{ row }">
          <el-tag v-for="t in (row.tags || '').split(',')" :key="t" size="small" style="margin:2px">{{ t }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="download_count" label="下载次数" width="100" align="center" />
      <el-table-column prop="created_at" label="上传时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button text type="primary" @click="openDialog(row)">编辑</el-button>
          <el-button text type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑资源' : '上传资源'" width="600px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="资源名称" prop="title" :rules="[{ required: true, message: '请输入资源名称' }]">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="资源类型" prop="type" :rules="[{ required: true, message: '请选择类型' }]">
          <el-select v-model="form.type" style="width:100%">
            <el-option label="教案" value="教案" />
            <el-option label="课件" value="课件" />
            <el-option label="试题" value="试题" />
            <el-option label="优秀案例" value="优秀案例" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="资源描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="form.tags" placeholder="多个标签用逗号分隔" />
        </el-form-item>
        <el-form-item label="文件链接" prop="file_url">
          <el-input v-model="form.file_url" placeholder="输入文件URL或留空" />
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
import { resourceApi } from '../../api/resource'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Resource } from '../../types'

const list = ref<Resource[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formRef = ref<any>(null)
const form = ref<any>({ title: '', type: '', description: '', tags: '', file_url: '' })

async function fetchData() {
  loading.value = true
  try { list.value = await resourceApi.list() } finally { loading.value = false }
}
function openDialog(row?: any) {
  editingId.value = row?.id ?? null
  form.value = row ? { ...row } : { title: '', type: '', description: '', tags: '', file_url: '' }
  dialogVisible.value = true
}
async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (editingId.value) {
      await resourceApi.update(editingId.value, form.value)
      ElMessage.success('更新成功')
    } else {
      await resourceApi.create(form.value)
      ElMessage.success('上传成功')
    }
    dialogVisible.value = false
    await fetchData()
  } finally { saving.value = false }
}
async function handleDelete(id: number) {
  await ElMessageBox.confirm('确定删除吗？', '确认')
  await resourceApi.delete(id)
  ElMessage.success('删除成功')
  await fetchData()
}
onMounted(fetchData)
</script>
