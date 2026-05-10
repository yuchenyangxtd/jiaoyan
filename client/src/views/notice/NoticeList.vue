<template>
  <div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h2>通知公告</h2>
      <el-button type="primary" @click="$router.push('/notices/create')"
        v-if="userStore.user?.role === 'admin' || userStore.user?.role === 'leader'">
        发布通知
      </el-button>
    </div>

    <el-table :data="notices" stripe style="width:100%">
      <el-table-column prop="title" label="标题">
        <template #default="{ row }">
          <span>{{ row.title }}</span>
          <el-tag v-if="row.is_pinned" size="small" type="warning" style="margin-left:8px">置顶</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" width="160">
        <template #default="{ row }">
          {{ new Date(row.created_at).toLocaleString('zh-CN') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" @click="viewDetail(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="detailVisible" :title="detailNotice?.title" width="600px">
      <div style="white-space:pre-wrap;">{{ detailNotice?.content }}</div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'
import { getNotices } from '../../api/notice'
import type { Notice } from '../../types'

const userStore = useUserStore()
const notices = ref<Notice[]>([])
const detailVisible = ref(false)
const detailNotice = ref<any>(null)

onMounted(async () => {
  notices.value = await getNotices()
})

function viewDetail(row: any) {
  detailNotice.value = row
  detailVisible.value = true
}
</script>
