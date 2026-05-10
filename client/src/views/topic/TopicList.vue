<template>
  <div>
    <div class="page-header">
      <el-button type="primary" @click="openDialog()">新建课题</el-button>
    </div>
    <el-table :data="list" v-loading="loading" stripe>
      <el-table-column prop="title" label="课题名称" min-width="200" />
      <el-table-column prop="type" label="类型" width="120">
        <template #default="{ row }">{{ row.type }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
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

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑课题' : '新建课题'" width="600px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="课题名称" prop="title" :rules="[{ required: true, message: '请输入课题名称' }]">
          <el-input v-model="form.title" placeholder="请输入课题名称" />
        </el-form-item>
        <el-form-item label="课题类型" prop="type" :rules="[{ required: true, message: '请选择课题类型' }]">
          <el-select v-model="form.type" placeholder="请选择" style="width:100%">
            <el-option label="课题申报" value="申报" />
            <el-option label="立项申请" value="立项" />
            <el-option label="中期检查" value="中期" />
            <el-option label="结题申请" value="结题" />
          </el-select>
        </el-form-item>
        <el-form-item label="课题内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="4" placeholder="请输入课题内容" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择" style="width:100%">
            <el-option label="草稿" value="draft" />
            <el-option label="提交审核" value="submitted" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
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
import { topicApi } from '../../api/topic'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Topic } from '../../types'

const list = ref<Topic[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formRef = ref<any>(null)
const form = ref<any>({ title: '', type: '', content: '', status: 'draft' })

async function fetchData() {
  loading.value = true
  try {
    list.value = await topicApi.list()
  } finally {
    loading.value = false
  }
}

function openDialog(row?: any) {
  if (row) {
    editingId.value = row.id
    form.value = { ...row }
  } else {
    editingId.value = null
    form.value = { title: '', type: '', content: '', status: 'draft' }
  }
  dialogVisible.value = true
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (editingId.value) {
      await topicApi.update(editingId.value, form.value)
      ElMessage.success('更新成功')
    } else {
      await topicApi.create(form.value)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    await fetchData()
  } finally {
    saving.value = false
  }
}

async function handleDelete(id: number) {
  await ElMessageBox.confirm('确定删除该课题吗？', '确认')
  await topicApi.delete(id)
  ElMessage.success('删除成功')
  await fetchData()
}

function statusLabel(s: string) {
  const map: Record<string, string> = { draft: '草稿', submitted: '待审核', approved: '已通过', rejected: '已驳回' }
  return map[s] || s
}
function statusType(s: string) {
  const map: Record<string, 'success' | 'warning' | 'info' | 'danger'> = { draft: 'info', submitted: 'warning', approved: 'success', rejected: 'danger' }
  return map[s] || 'info'
}

onMounted(fetchData)
</script>
