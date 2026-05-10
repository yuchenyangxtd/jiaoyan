<template>
  <div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h2>材料提交</h2>
      <el-button type="primary" @click="$router.push('/materials/submit')">提交材料</el-button>
    </div>

    <el-table :data="materials" stripe style="width:100%">
      <el-table-column prop="title" label="材料名称" />
      <el-table-column prop="status" label="审核状态" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'danger' : 'warning'">
            {{ row.status === 'approved' ? '已通过' : row.status === 'rejected' ? '已退回' : '待审核' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="提交时间" width="160">
        <template #default="{ row }">
          {{ new Date(row.created_at).toLocaleString('zh-CN') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
          <el-button v-if="row.status === 'pending' && (userStore.user?.role === 'admin' || userStore.user?.role === 'group_leader')"
            link type="primary" @click="showReview(row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="detailVisible" title="材料详情" width="500px">
      <p><strong>{{ currentDetail?.title }}</strong></p>
      <p style="color:#666; margin-top:12px; white-space:pre-wrap;">{{ currentDetail?.description || '无文本内容' }}</p>
      <p v-if="currentDetail?.comment" style="margin-top:12px; padding:12px; background:#F8FAFC; border-radius:8px;">
        <strong>审核意见：</strong>{{ currentDetail.comment }}
      </p>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="reviewVisible" title="审核材料" width="500px">
      <p style="margin-bottom:12px"><strong>{{ currentMaterial?.title }}</strong></p>
      <el-radio-group v-model="reviewStatus" style="margin-bottom:12px">
        <el-radio value="approved">通过</el-radio>
        <el-radio value="rejected">退回</el-radio>
      </el-radio-group>
      <el-input v-model="reviewComment" type="textarea" :rows="3" placeholder="审核意见" />
      <template #footer>
        <el-button @click="reviewVisible = false">取消</el-button>
        <el-button type="primary" @click="handleReview">提交审核</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import { getMaterials, reviewMaterial } from '../../api/material'
import type { Material } from '../../types'

const userStore = useUserStore()
const materials = ref<Material[]>([])
const detailVisible = ref(false)
const currentDetail = ref<any>(null)
const reviewVisible = ref(false)
const currentMaterial = ref<any>(null)
const reviewStatus = ref('approved')
const reviewComment = ref('')

onMounted(async () => {
  materials.value = await getMaterials()
})

function viewDetail(row: any) {
  currentDetail.value = row
  detailVisible.value = true
}

function showReview(row: any) {
  currentMaterial.value = row
  reviewStatus.value = 'approved'
  reviewComment.value = ''
  reviewVisible.value = true
}

async function handleReview() {
  if (!currentMaterial.value) return
  await reviewMaterial(currentMaterial.value.id, {
    status: reviewStatus.value,
    comment: reviewComment.value,
  })
  reviewVisible.value = false
  materials.value = await getMaterials()
}
</script>
