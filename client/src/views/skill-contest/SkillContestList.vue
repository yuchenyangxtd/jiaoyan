<template>
  <div>
    <div class="page-header">
      <el-button type="primary" @click="openDialog()">新建技能赛</el-button>
    </div>
    <el-table :data="list" v-loading="loading" stripe>
      <el-table-column prop="title" label="赛项名称" min-width="200" />
      <el-table-column prop="level" label="级别" width="120" />
      <el-table-column prop="contest_date" label="比赛日期" width="150" />
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

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑技能赛' : '新建技能赛'" width="600px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="赛项名称" prop="title" :rules="[{ required: true, message: '请输入赛项名称' }]">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="比赛说明" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="比赛日期" prop="contest_date">
          <el-date-picker v-model="form.contest_date" type="date" style="width:100%" />
        </el-form-item>
        <el-form-item label="比赛级别" prop="level">
          <el-select v-model="form.level" style="width:100%">
            <el-option label="校级" value="校级" />
            <el-option label="区级" value="区级" />
            <el-option label="市级" value="市级" />
            <el-option label="省级" value="省级" />
            <el-option label="国家级" value="国家级" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" style="width:100%">
            <el-option label="即将开始" value="upcoming" />
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
import { skillContestApi } from '../../api/skillContest'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { SkillContest } from '../../types'

const list = ref<SkillContest[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const editingId = ref<number | null>(null)
const saving = ref(false)
const formRef = ref<any>(null)
const form = ref<any>({ title: '', description: '', contest_date: '', level: '', status: 'upcoming' })

async function fetchData() {
  loading.value = true
  try { list.value = await skillContestApi.list() } finally { loading.value = false }
}
function openDialog(row?: any) {
  editingId.value = row?.id ?? null
  form.value = row ? { ...row } : { title: '', description: '', contest_date: '', level: '', status: 'upcoming' }
  dialogVisible.value = true
}
async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (editingId.value) {
      await skillContestApi.update(editingId.value, form.value)
      ElMessage.success('更新成功')
    } else {
      await skillContestApi.create(form.value)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    await fetchData()
  } finally { saving.value = false }
}
async function handleDelete(id: number) {
  await ElMessageBox.confirm('确定删除吗？', '确认')
  await skillContestApi.delete(id)
  ElMessage.success('删除成功')
  await fetchData()
}
function statusLabel(s: string) { const m: Record<string, string> = { upcoming: '即将开始', ongoing: '进行中', ended: '已结束' }; return m[s] || s }
function statusType(s: string) { const m: Record<string, 'success' | 'warning' | 'info'> = { upcoming: 'info', ongoing: 'warning', ended: 'success' }; return m[s] || 'info' }
onMounted(fetchData)
</script>
