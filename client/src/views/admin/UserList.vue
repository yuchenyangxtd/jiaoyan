<template>
  <div>
    <!-- 操作栏 -->
    <el-card shadow="never" class="search-bar">
      <el-row :gutter="12">
        <el-col :span="7">
          <el-input v-model="searchQuery" placeholder="搜索姓名 / 工号 / 部门" clearable @input="onSearch">
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-select v-model="roleFilter" placeholder="全部角色" clearable @change="fetchData" style="width:100%">
            <el-option label="全部角色" value="" />
            <el-option label="管理员" value="admin" />
            <el-option label="教研组长" value="group_leader" />
            <el-option label="教师" value="teacher" />
            <el-option label="领导" value="leader" />
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select v-model="statusFilter" placeholder="全部状态" clearable @change="fetchData" style="width:100%">
            <el-option label="全部状态" value="" />
            <el-option label="正常" value="active" />
            <el-option label="已禁用" value="disabled" />
          </el-select>
        </el-col>
        <el-col :span="7" style="text-align:right; white-space:nowrap">
          <el-button type="primary" @click="openCreateDialog">
            <el-icon><Plus /></el-icon>新增
          </el-button>
          <el-button @click="showImportDialog = true">
            <el-icon><Upload /></el-icon>Excel导入
          </el-button>
        </el-col>
      </el-row>
      <!-- 批量操作栏 -->
      <el-row v-if="selectedIds.length > 0" style="margin-top:12px">
        <el-col>
          <span style="font-size:13px;color:#666;margin-right:12px">已选 {{ selectedIds.length }} 项</span>
          <el-button size="small" @click="showBatchUpdate = true">批量修改</el-button>
          <el-button size="small" type="danger" @click="handleBatchDelete">批量删除</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 用户列表 -->
    <el-card shadow="never" style="margin-top:16px">
      <el-table
        :data="filteredList" v-loading="loading" stripe style="width:100%"
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" width="44" />
        <el-table-column prop="username" label="工号" width="110" />
        <el-table-column prop="real_name" label="姓名" width="110" />
        <el-table-column label="角色" width="110">
          <template #default="{ row }">
            <el-tag :type="roleType(row.role)" size="small">{{ roleLabel(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门" min-width="130" />
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.is_active"
              :loading="togglingId === row.id"
              size="small"
              @click.prevent="toggleActive(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="175" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" @click="openEditDialog(row)">编辑</el-button>
            <el-button text type="warning" @click="openResetPwdDialog(row)">重置密码</el-button>
            <el-button text type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:12px;color:#999;font-size:13px">
        共 {{ filteredList.length }} 条记录
      </div>
    </el-card>

    <!-- 新增 / 编辑对话框 -->
    <el-dialog v-model="formVisible" :title="isEditing ? '编辑用户' : '新增用户'" width="520px" :close-on-click-modal="false">
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="90px">
        <el-form-item label="工号" prop="username">
          <el-input v-model="form.username" :disabled="isEditing" placeholder="登录用的工号" />
        </el-form-item>
        <el-form-item label="姓名" prop="real_name">
          <el-input v-model="form.real_name" placeholder="真实姓名" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" style="width:100%">
            <el-option label="教师" value="teacher" />
            <el-option label="教研组长" value="group_leader" />
            <el-option label="管理员" value="admin" />
            <el-option label="领导" value="leader" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="form.department" placeholder="所属部门或专业部" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEditing">
          <el-input v-model="form.password" type="password" show-password placeholder="默认 123456" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">保存</el-button>
      </template>
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog v-model="pwdVisible" title="重置密码" width="380px">
      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="80px">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="pwdForm.password" type="password" show-password placeholder="输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pwdVisible = false">取消</el-button>
        <el-button type="primary" @click="handleResetPwd" :loading="saving">确认重置</el-button>
      </template>
    </el-dialog>

    <!-- Excel导入对话框 -->
    <el-dialog v-model="showImportDialog" title="Excel 导入用户" width="560px" :close-on-click-modal="false">
      <template v-if="importResult === null">
        <div style="text-align:center;padding:30px 0" @drop.prevent="onDrop" @dragover.prevent>
          <el-icon style="font-size:48px;color:var(--el-color-primary)"><Upload /></el-icon>
          <p style="margin:12px 0 8px;color:#333;font-weight:600">选择 Excel 文件</p>
          <p style="font-size:13px;color:#999;margin-bottom:16px">
            支持 .xlsx / .xls 格式，需包含「工号」「姓名」「部门」列
          </p>
          <input ref="fileInputRef" type="file" accept=".xlsx,.xls" style="display:none" @change="onFileChange" />
          <el-button type="primary" @click="fileInputRef?.click()">
            <el-icon><FolderOpened /></el-icon>选择文件
          </el-button>
        </div>
        <el-form label-width="90px" style="margin-top:8px">
          <el-form-item label="初始密码">
            <el-input v-model="importPassword" placeholder="默认 123456" style="width:200px" />
          </el-form-item>
        </el-form>
      </template>
      <template v-else>
        <el-result
          :status="importResult.failed === 0 ? 'success' : 'warning'"
          :title="`导入完成：成功 ${importResult.success} 人`"
          :sub-title="importResult.failed > 0 ? `失败 ${importResult.failed} 人` : ''"
        >
          <template #extra>
            <div v-if="importResult.errors.length" style="text-align:left;max-height:200px;overflow:auto">
              <p v-for="e in importResult.errors" :key="e" style="font-size:12px;color:#e74c3c;margin:2px 0">{{ e }}</p>
            </div>
          </template>
        </el-result>
      </template>
      <template #footer>
        <el-button v-if="importResult !== null" @click="showImportDialog = false; importResult = null">关闭</el-button>
        <el-button v-else @click="showImportDialog = false">取消</el-button>
        <el-button v-if="importResult === null" type="primary" @click="handleImport" :loading="importing">开始导入</el-button>
      </template>
    </el-dialog>

    <!-- 批量修改对话框 -->
    <el-dialog v-model="showBatchUpdate" title="批量修改" width="420px">
      <p style="font-size:13px;color:#666;margin-bottom:12px">已选 {{ selectedIds.length }} 名用户</p>
      <el-form label-width="80px">
        <el-form-item label="角色">
          <el-select v-model="batchRole" placeholder="保持不变" clearable style="width:100%">
            <el-option label="教师" value="teacher" />
            <el-option label="教研组长" value="group_leader" />
            <el-option label="管理员" value="admin" />
            <el-option label="领导" value="leader" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="batchDepartment" placeholder="保持不变则不填" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBatchUpdate = false">取消</el-button>
        <el-button type="primary" @click="handleBatchUpdate" :loading="batchLoading">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiClient } from '../../api/client'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Upload, FolderOpened } from '@element-plus/icons-vue'
import type { UserProfile } from '../../types'

/* ===== 数据 ===== */
const users = ref<UserProfile[]>([])
const loading = ref(false)
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')

const filteredList = computed(() => {
  let list = users.value
  const q = searchQuery.value.trim().toLowerCase()
  if (q) list = list.filter(u =>
    u.real_name.toLowerCase().includes(q) ||
    u.username.toLowerCase().includes(q) ||
    (u.department || '').toLowerCase().includes(q)
  )
  if (roleFilter.value) list = list.filter(u => u.role === roleFilter.value)
  if (statusFilter.value === 'active') list = list.filter(u => u.is_active)
  if (statusFilter.value === 'disabled') list = list.filter(u => !u.is_active)
  return list
})

async function fetchData() {
  loading.value = true
  try { users.value = await apiClient.get('/users') } finally { loading.value = false }
}

/* ===== 批量选择 ===== */
const selectedIds = ref<string[]>([])
function onSelectionChange(rows: any[]) {
  selectedIds.value = rows.map(r => r.id)
}

/* ===== 新增 / 编辑 ===== */
const formVisible = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const formRef = ref<any>(null)
const form = ref({ username: '', real_name: '', role: 'teacher', department: '', password: '123456' })
const formRules = {
  username: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  real_name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

function openCreateDialog() {
  isEditing.value = false
  editingId.value = null
  form.value = { username: '', real_name: '', role: 'teacher', department: '', password: '123456' }
  formVisible.value = true
}

function openEditDialog(row: UserProfile) {
  isEditing.value = true
  editingId.value = row.id
  form.value = { username: row.username, real_name: row.real_name, role: row.role, department: row.department || '', password: '' }
  formVisible.value = true
}

async function handleSave() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  try {
    if (isEditing.value && editingId.value) {
      const body: any = { real_name: form.value.real_name, role: form.value.role, department: form.value.department }
      if (form.value.password) body.password = form.value.password
      await apiClient.patch(`/users/${editingId.value}`, body)
      ElMessage.success('用户更新成功')
    } else {
      await apiClient.post('/users', form.value)
      ElMessage.success('用户创建成功')
    }
    formVisible.value = false
    await fetchData()
  } catch (e: any) {
    ElMessage.error(e.message || '操作失败')
  } finally { saving.value = false }
}

/* ===== 启用 / 禁用 ===== */
const togglingId = ref<string | null>(null)
async function toggleActive(row: UserProfile) {
  togglingId.value = row.id
  try {
    const action = row.is_active ? '禁用' : '启用'
    await ElMessageBox.confirm(`确定${action}用户 "${row.real_name}" 吗？`, '确认')
    await apiClient.patch(`/users/${row.id}`, { is_active: !row.is_active })
    ElMessage.success(`${action}成功`)
    await fetchData()
  } catch (e: any) {
    const msg = e?.message || String(e || '')
    if (msg.includes('cancel') || msg.includes('Cancel')) return
    ElMessage.error(msg || '操作失败')
  } finally { togglingId.value = null }
}

/* ===== 重置密码 ===== */
const pwdVisible = ref(false)
const pwdFormRef = ref<any>(null)
const pwdForm = ref({ password: '' })
const resetPwdUserId = ref<string | null>(null)
const pwdRules = { password: [{ required: true, message: '请输入新密码', trigger: 'blur' }] }

function openResetPwdDialog(row: UserProfile) {
  resetPwdUserId.value = row.id
  pwdForm.value = { password: '' }
  pwdVisible.value = true
}

async function handleResetPwd() {
  const valid = await pwdFormRef.value?.validate().catch(() => false)
  if (!valid || !resetPwdUserId.value) return
  saving.value = true
  try {
    await apiClient.patch(`/users/${resetPwdUserId.value}`, { password: pwdForm.value.password })
    ElMessage.success('密码已重置')
    pwdVisible.value = false
  } catch (e: any) {
    ElMessage.error(e.message || '重置失败')
  } finally { saving.value = false }
}

/* ===== 单个删除 ===== */
async function handleDelete(row: UserProfile) {
  await ElMessageBox.confirm(`确定删除用户 "${row.real_name}（${row.username}）" 吗？此操作不可恢复。`, '确认删除', { type: 'warning' })
  try {
    await apiClient.post('/users/batch-delete', { ids: [row.id] })
    ElMessage.success('用户已删除')
    await fetchData()
  } catch (e: any) {
    ElMessage.error(e.message || '删除失败')
  }
}

/* ===== Excel导入 ===== */
const showImportDialog = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const importPassword = ref('123456')
const importResult = ref<any>(null)
const importing = ref(false)
let importFile: File | null = null

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) importFile = target.files[0]
}
function onDrop(e: DragEvent) {
  if (e.dataTransfer?.files.length) importFile = e.dataTransfer.files[0]
}

async function handleImport() {
  if (!importFile) { ElMessage.warning('请先选择文件'); return }
  importing.value = true
  try {
    const formData = new FormData()
    formData.append('file', importFile)
    formData.append('password', importPassword.value)
    const res = await fetch('http://localhost:3000/api/users/import', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || '导入失败')
    importResult.value = data
    await fetchData()
  } catch (e: any) {
    ElMessage.error(e.message || '导入失败')
  } finally { importing.value = false }
}

/* ===== 批量操作 ===== */
const showBatchUpdate = ref(false)
const batchRole = ref('')
const batchDepartment = ref('')
const batchLoading = ref(false)

async function handleBatchDelete() {
  if (!selectedIds.value.length) return
  await ElMessageBox.confirm(`确定删除已选的 ${selectedIds.value.length} 名用户？此操作不可恢复。`, '危险操作')
  try {
    const res = await apiClient.post('/users/batch-delete', { ids: selectedIds.value })
    ElMessage.success(`已删除 ${res.deleted} 人`)
    selectedIds.value = []
    await fetchData()
  } catch (e: any) {
    ElMessage.error(e.message || '删除失败')
  }
}

async function handleBatchUpdate() {
  if (!selectedIds.value.length) return
  const data: any = {}
  if (batchRole.value) data.role = batchRole.value
  if (batchDepartment.value) data.department = batchDepartment.value
  if (!Object.keys(data).length) { ElMessage.warning('请至少选择一项修改内容'); return }
  batchLoading.value = true
  try {
    const res = await apiClient.post('/users/batch-update', { ids: selectedIds.value, data })
    ElMessage.success(`已更新 ${res.updated} 人`)
    showBatchUpdate.value = false
    selectedIds.value = []
    await fetchData()
  } catch (e: any) {
    ElMessage.error(e.message || '更新失败')
  } finally { batchLoading.value = false }
}

/* ===== 辅助 ===== */
function roleLabel(r: string) {
  const map: Record<string, string> = { teacher: '教师', group_leader: '教研组长', admin: '管理员', leader: '领导' }
  return map[r] || r
}
function roleType(r: string) {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'info'> = { teacher: 'info', group_leader: 'warning', admin: 'danger', leader: 'success' }
  return map[r] || 'info'
}
function onSearch() {}

onMounted(fetchData)
</script>

<style scoped>
.search-bar {
  border-radius: 8px;
}
</style>
