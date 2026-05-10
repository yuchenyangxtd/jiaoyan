<template>
  <div>
    <!-- 顶部 -->
    <div class="page-header" style="margin-bottom:20px; display:flex; align-items:center; justify-content:space-between">
      <h3 style="margin:0">{{ activeView ? detailTitle : '全校教研数据概览' }}</h3>
      <el-button v-if="activeView" text @click="activeView = ''">
        <el-icon><ArrowLeft /></el-icon> 返回概览
      </el-button>
    </div>

    <!-- 数据卡片：3x3 布局 -->
    <el-row :gutter="20" style="margin-bottom:24px">
      <el-col :span="8" v-for="card in cards" :key="card.key">
        <el-card
          shadow="hover"
          :body-style="{ cursor: 'pointer', padding: '20px' }"
          :class="{ 'is-active': activeView === card.key }"
          @click="handleCardClick(card.key)"
        >
          <div class="stat-card">
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
            <div class="stat-hint">点击查看详情 →</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 概览视图：部门 + 角色分布 -->
    <template v-if="!activeView">
      <el-row :gutter="20">
        <el-col :span="14">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">部门人员分布</span></template>
            <el-table :data="overview.deptStats" v-loading="overview.loading" stripe size="small" max-height="420">
              <el-table-column prop="name" label="部门" min-width="140" />
              <el-table-column prop="count" label="人数" width="80" align="center" />
              <el-table-column label="占比" width="100" align="center">
                <template #default="{ row }">
                  <span style="font-size:13px">{{ ratio(row.count, overview.total) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="分布" min-width="160">
                <template #default="{ row }">
                  <el-progress :percentage="pct(row.count, overview.total)" :stroke-width="12" :show-text="false" :color="barColor(row.name)" />
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">角色分布</span></template>
            <el-table :data="overview.roleStats" v-loading="overview.loading" stripe size="small">
              <el-table-column label="角色" min-width="120">
                <template #default="{ row }"><el-tag :type="roleType(row.name)" size="small">{{ roleLabel(row.name) }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="count" label="人数" width="70" align="center" />
              <el-table-column label="占比" width="100" align="center">
                <template #default="{ row }"><span style="font-size:13px">{{ ratio(row.count, overview.total) }}</span></template>
              </el-table-column>
              <el-table-column label="分布" min-width="140">
                <template #default="{ row }">
                  <el-progress :percentage="pct(row.count, overview.total)" :stroke-width="12" :show-text="false" />
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <!-- 详情：教职工 -->
    <template v-else-if="activeView === 'users'">
      <el-row :gutter="20">
        <el-col :span="14">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">部门分布</span></template>
            <el-table :data="detail.users?.deptStats" v-loading="detail.loading" stripe size="small" max-height="480">
              <el-table-column prop="name" label="部门" min-width="140" />
              <el-table-column prop="count" label="人数" width="80" align="center" />
              <el-table-column label="占比" width="100" align="center">
                <template #default="{ row }"><span style="font-size:13px">{{ ratio(row.count, totalStaff) }}</span></template>
              </el-table-column>
              <el-table-column label="分布" min-width="180">
                <template #default="{ row }">
                  <el-progress :percentage="pct(row.count, totalStaff)" :stroke-width="16" :show-text="false" :color="barColor(row.name)" />
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">角色分布</span></template>
            <el-table :data="detail.users?.roleStats" v-loading="detail.loading" stripe size="small">
              <el-table-column label="角色" min-width="120">
                <template #default="{ row }"><el-tag :type="roleType(row.name)" size="small">{{ roleLabel(row.name) }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="count" label="人数" width="70" align="center" />
              <el-table-column label="占比" width="100" align="center">
                <template #default="{ row }"><span style="font-size:13px">{{ ratio(row.count, totalStaff) }}</span></template>
              </el-table-column>
              <el-table-column label="分布" min-width="140">
                <template #default="{ row }">
                  <el-progress :percentage="pct(row.count, totalStaff)" :stroke-width="16" :show-text="false" />
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </template>

    <!-- 详情：教研计划 -->
    <template v-else-if="activeView === 'plans'">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">按状态</span></template>
            <div v-for="s in detail.plans?.byStatus" :key="s.name" class="stat-row">
              <span class="stat-row-label">{{ statusLabel('plan', s.name) }}</span>
              <span class="stat-row-count">{{ s.count }}</span>
              <el-progress :percentage="pct(s.count, planTotal)" :stroke-width="14" :show-text="false" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">按部门</span></template>
            <el-table :data="(detail.plans?.byDept || []).slice(0, 10)" stripe size="small" max-height="360">
              <el-table-column prop="name" label="部门" min-width="100" />
              <el-table-column prop="count" label="数量" width="60" align="center" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">按学期</span></template>
            <el-table :data="detail.plans?.bySemester" stripe size="small" max-height="360">
              <el-table-column prop="name" label="学期" min-width="100" />
              <el-table-column prop="count" label="数量" width="60" align="center" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="never" style="margin-top:20px">
        <template #header><span style="font-weight:600">最近计划</span></template>
        <el-table :data="detail.plans?.recent" size="small" v-if="detail.plans?.recent?.length">
          <el-table-column prop="title" label="标题" min-width="200" />
          <el-table-column prop="semester" label="学期" width="100" />
          <el-table-column prop="department" label="部门" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }"><el-tag :type="statusTag('plan', row.status)" size="small">{{ statusLabel('plan', row.status) }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="175" />
        </el-table>
      </el-card>
    </template>

    <!-- 详情：教研活动 -->
    <template v-else-if="activeView === 'activities'">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">按类型</span></template>
            <el-table :data="detail.activities?.byType" stripe size="small" max-height="360">
              <el-table-column prop="name" label="类型" min-width="100" />
              <el-table-column prop="count" label="数量" width="60" align="center" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">按状态</span></template>
            <div v-for="s in detail.activities?.byStatus" :key="s.name" class="stat-row">
              <span class="stat-row-label">{{ statusLabel('activity', s.name) }}</span>
              <span class="stat-row-count">{{ s.count }}</span>
              <el-progress :percentage="pct(s.count, activityTotal)" :stroke-width="14" :show-text="false" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">快速操作</span></template>
            <div style="padding:20px 0; text-align:center">
              <el-button type="primary" @click="$router.push('/activities/create')">创建新活动</el-button>
              <el-button style="margin-top:12px; display:block; width:100%" @click="$router.push('/activities')">查看全部活动</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="never" style="margin-top:20px">
        <template #header><span style="font-weight:600">最近活动</span></template>
        <el-table :data="detail.activities?.recent" size="small" v-if="detail.activities?.recent?.length">
          <el-table-column prop="title" label="标题" min-width="200" />
          <el-table-column prop="type" label="类型" width="120" />
          <el-table-column prop="date" label="日期" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }"><el-tag :type="statusTag('activity', row.status)" size="small">{{ statusLabel('activity', row.status) }}</el-tag></template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>

    <!-- 详情：教研材料 -->
    <template v-else-if="activeView === 'materials'">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">按状态</span></template>
            <div v-for="s in detail.materials?.byStatus" :key="s.name" class="stat-row">
              <span class="stat-row-label">{{ statusLabel('material', s.name) }}</span>
              <span class="stat-row-count">{{ s.count }}</span>
              <el-progress :percentage="pct(s.count, materialTotal)" :stroke-width="14" :show-text="false" :color="statusColor(s.name)" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">快速操作</span></template>
            <div style="padding:20px 0; text-align:center">
              <el-button type="primary" @click="$router.push('/materials/submit')">提交新材料</el-button>
              <el-button style="margin-top:12px; display:block; width:100%" @click="$router.push('/materials')">查看全部材料</el-button>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">汇总</span></template>
            <div class="summary-card">
              <div class="summary-item">
                <span class="summary-label">待审核</span>
                <span class="summary-value" style="color:#E6A23C">{{ pendingCount }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">已通过</span>
                <span class="summary-value" style="color:#67C23A">{{ approvedCount }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">已驳回</span>
                <span class="summary-value" style="color:#F56C6C">{{ rejectedCount }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="never" style="margin-top:20px">
        <template #header><span style="font-weight:600">最近提交</span></template>
        <el-table :data="detail.materials?.recent" size="small" v-if="detail.materials?.recent?.length">
          <el-table-column prop="title" label="标题" min-width="200" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }"><el-tag :type="statusTag('material', row.status)" size="small">{{ statusLabel('material', row.status) }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="created_at" label="提交时间" width="175" />
        </el-table>
      </el-card>
    </template>

    <!-- 详情：课题研究 -->
    <template v-else-if="activeView === 'topics'">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">按类型</span></template>
            <el-table :data="detail.topics?.byType" stripe size="small" max-height="360">
              <el-table-column prop="name" label="类型" min-width="100" />
              <el-table-column prop="count" label="数量" width="60" align="center" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">按状态</span></template>
            <div v-for="s in detail.topics?.byStatus" :key="s.name" class="stat-row">
              <span class="stat-row-label">{{ statusLabel('plan', s.name) }}</span>
              <span class="stat-row-count">{{ s.count }}</span>
              <el-progress :percentage="pct(s.count, topicTotal)" :stroke-width="14" :show-text="false" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">快速操作</span></template>
            <div style="padding:20px 0; text-align:center">
              <el-button type="primary" @click="$router.push('/topics/create')">创建新课题</el-button>
              <el-button style="margin-top:12px; display:block; width:100%" @click="$router.push('/topics')">查看全部课题</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="never" style="margin-top:20px">
        <template #header><span style="font-weight:600">最近课题</span></template>
        <el-table :data="detail.topics?.recent" size="small" v-if="detail.topics?.recent?.length">
          <el-table-column prop="title" label="标题" min-width="200" />
          <el-table-column prop="type" label="类型" width="100" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }"><el-tag :type="statusTag('plan', row.status)" size="small">{{ statusLabel('plan', row.status) }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="175" />
        </el-table>
      </el-card>
    </template>

    <!-- 详情：教师竞赛 -->
    <template v-else-if="activeView === 'competitions'">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">按状态</span></template>
            <div v-for="s in detail.competitions?.byStatus" :key="s.name" class="stat-row">
              <span class="stat-row-label">{{ statusLabel('competition', s.name) }}</span>
              <span class="stat-row-count">{{ s.count }}</span>
              <el-progress :percentage="pct(s.count, competitionTotal)" :stroke-width="14" :show-text="false" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">快速操作</span></template>
            <div style="padding:20px 0; text-align:center">
              <el-button type="primary" @click="$router.push('/competitions/create')">创建新竞赛</el-button>
              <el-button style="margin-top:12px; display:block; width:100%" @click="$router.push('/competitions')">查看全部竞赛</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="never" style="margin-top:20px">
        <template #header><span style="font-weight:600">最近竞赛</span></template>
        <el-table :data="detail.competitions?.recent" size="small" v-if="detail.competitions?.recent?.length">
          <el-table-column prop="title" label="标题" min-width="200" />
          <el-table-column prop="deadline" label="截止日期" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }"><el-tag :type="statusTag('competition', row.status)" size="small">{{ statusLabel('competition', row.status) }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="175" />
        </el-table>
      </el-card>
    </template>

    <!-- 详情：学生技能赛 -->
    <template v-else-if="activeView === 'skillContests'">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">按级别</span></template>
            <el-table :data="detail.skillContests?.byLevel" stripe size="small" max-height="360">
              <el-table-column prop="name" label="级别" min-width="100" />
              <el-table-column prop="count" label="数量" width="60" align="center" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">按状态</span></template>
            <div v-for="s in detail.skillContests?.byStatus" :key="s.name" class="stat-row">
              <span class="stat-row-label">{{ statusLabel('competition', s.name) }}</span>
              <span class="stat-row-count">{{ s.count }}</span>
              <el-progress :percentage="pct(s.count, skillContestTotal)" :stroke-width="14" :show-text="false" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">快速操作</span></template>
            <div style="padding:20px 0; text-align:center">
              <el-button type="primary" @click="$router.push('/skill-contests/create')">创建新赛项</el-button>
              <el-button style="margin-top:12px; display:block; width:100%" @click="$router.push('/skill-contests')">查看全部赛项</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="never" style="margin-top:20px">
        <template #header><span style="font-weight:600">最近比赛</span></template>
        <el-table :data="detail.skillContests?.recent" size="small" v-if="detail.skillContests?.recent?.length">
          <el-table-column prop="title" label="标题" min-width="200" />
          <el-table-column prop="level" label="级别" width="100" />
          <el-table-column prop="contest_date" label="比赛日期" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }"><el-tag :type="statusTag('competition', row.status)" size="small">{{ statusLabel('competition', row.status) }}</el-tag></template>
          </el-table-column>
        </el-table>
      </el-card>
    </template>

    <!-- 详情：培训管理 -->
    <template v-else-if="activeView === 'trainings'">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">按状态</span></template>
            <div v-for="s in detail.trainings?.byStatus" :key="s.name" class="stat-row">
              <span class="stat-row-label">{{ statusLabel('training', s.name) }}</span>
              <span class="stat-row-count">{{ s.count }}</span>
              <el-progress :percentage="pct(s.count, trainingTotal)" :stroke-width="14" :show-text="false" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">快速操作</span></template>
            <div style="padding:20px 0; text-align:center">
              <el-button type="primary" @click="$router.push('/trainings/create')">创建新培训</el-button>
              <el-button style="margin-top:12px; display:block; width:100%" @click="$router.push('/trainings')">查看全部培训</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="never" style="margin-top:20px">
        <template #header><span style="font-weight:600">最近培训</span></template>
        <el-table :data="detail.trainings?.recent" size="small" v-if="detail.trainings?.recent?.length">
          <el-table-column prop="title" label="标题" min-width="200" />
          <el-table-column prop="location" label="地点" width="140" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }"><el-tag :type="statusTag('training', row.status)" size="small">{{ statusLabel('training', row.status) }}</el-tag></template>
          </el-table-column>
          <el-table-column prop="start_date" label="开始日期" width="110" />
          <el-table-column prop="end_date" label="结束日期" width="110" />
        </el-table>
      </el-card>
    </template>

    <!-- 详情：资源库 -->
    <template v-else-if="activeView === 'resources'">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">按类型</span></template>
            <el-table :data="detail.resources?.byType" stripe size="small" max-height="360">
              <el-table-column prop="name" label="类型" min-width="100" />
              <el-table-column prop="count" label="数量" width="60" align="center" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">汇总</span></template>
            <div class="summary-card">
              <div class="summary-item">
                <span class="summary-label">资源总数</span>
                <span class="summary-value" style="color:#409EFF">{{ resourceTotal }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">总下载次数</span>
                <span class="summary-value" style="color:#67C23A">{{ detail.resources?.totalDownloads || 0 }}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never">
            <template #header><span style="font-weight:600">快速操作</span></template>
            <div style="padding:20px 0; text-align:center">
              <el-button type="primary" @click="$router.push('/resources/upload')">上传新资源</el-button>
              <el-button style="margin-top:12px; display:block; width:100%" @click="$router.push('/resources')">查看全部资源</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="never" style="margin-top:20px">
        <template #header><span style="font-weight:600">最近上传</span></template>
        <el-table :data="detail.resources?.recent" size="small" v-if="detail.resources?.recent?.length">
          <el-table-column prop="title" label="标题" min-width="200" />
          <el-table-column prop="type" label="类型" width="100" />
          <el-table-column prop="download_count" label="下载次数" width="100" align="center" />
          <el-table-column prop="created_at" label="上传时间" width="175" />
        </el-table>
      </el-card>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { statisticsApi } from '../../api/statistics'
import { ArrowLeft } from '@element-plus/icons-vue'
import type { UsersDetail, PlansDetail, ActivitiesDetail, MaterialsDetail, TopicsDetail, CompetitionsDetail, SkillContestsDetail, TrainingsDetail, ResourcesDetail, StatItem } from '../../types'

/* ===== 卡片数据 ===== */
const cards = ref<{ key: string; label: string; value: number }[]>([])
const totalStaff = ref(0)
const planTotal = computed(() => cards.value.find(c => c.key === 'plans')?.value || 0)
const activityTotal = computed(() => cards.value.find(c => c.key === 'activities')?.value || 0)
const materialTotal = computed(() => cards.value.find(c => c.key === 'materials')?.value || 0)
const topicTotal = computed(() => cards.value.find(c => c.key === 'topics')?.value || 0)
const competitionTotal = computed(() => cards.value.find(c => c.key === 'competitions')?.value || 0)
const skillContestTotal = computed(() => cards.value.find(c => c.key === 'skillContests')?.value || 0)
const trainingTotal = computed(() => cards.value.find(c => c.key === 'trainings')?.value || 0)
const resourceTotal = computed(() => cards.value.find(c => c.key === 'resources')?.value || 0)

/* ===== 视图切换 ===== */
const activeView = ref('')

const detailTitle = computed(() => {
  const map: Record<string, string> = { users: '教职工数据详情', plans: '教研计划详情', activities: '教研活动详情', materials: '教研材料详情', topics: '课题研究详情', competitions: '教师竞赛详情', skillContests: '学生技能赛详情', trainings: '培训管理详情', resources: '资源库详情' }
  return map[activeView.value] || ''
})

/* ===== 概览数据 ===== */
const overview = reactive({ deptStats: [] as StatItem[], roleStats: [] as StatItem[], total: 0, loading: false })

/* ===== 详情数据 ===== */
const detail = reactive({
  loading: false,
  users: null as any,
  plans: null as any,
  activities: null as any,
  materials: null as any,
  topics: null as any,
  competitions: null as any,
  skillContests: null as any,
  trainings: null as any,
  resources: null as any,
})

/* ===== 计算字段 ===== */
const pendingCount = computed(() => detail.materials?.byStatus?.find((s: StatItem) => s.name === 'pending')?.count || 0)
const approvedCount = computed(() => detail.materials?.byStatus?.find((s: StatItem) => s.name === 'approved')?.count || 0)
const rejectedCount = computed(() => detail.materials?.byStatus?.find((s: StatItem) => s.name === 'rejected')?.count || 0)

/* ===== 卡片点击 ===== */
async function handleCardClick(key: string) {
  if (key === 'users' && !detail.users) {
    detail.users = await statisticsApi.users()
  } else if (key === 'plans' && !detail.plans) {
    detail.plans = await statisticsApi.plans()
  } else if (key === 'activities' && !detail.activities) {
    detail.activities = await statisticsApi.activities()
  } else if (key === 'materials' && !detail.materials) {
    detail.materials = await statisticsApi.materials()
  } else if (key === 'topics' && !detail.topics) {
    detail.topics = await statisticsApi.topics()
  } else if (key === 'competitions' && !detail.competitions) {
    detail.competitions = await statisticsApi.competitions()
  } else if (key === 'skillContests' && !detail.skillContests) {
    detail.skillContests = await statisticsApi.skillContests()
  } else if (key === 'trainings' && !detail.trainings) {
    detail.trainings = await statisticsApi.trainings()
  } else if (key === 'resources' && !detail.resources) {
    detail.resources = await statisticsApi.resources()
  }
  activeView.value = key
}

/* ===== 工具函数 ===== */
function pct(val: number, total: number) { return total ? +(val / total * 100).toFixed(1) : 0 }
function ratio(val: number, total: number) { return total ? (val / total * 100).toFixed(1) + '%' : '0%' }

const colorPalette = ['#409EFF','#67C23A','#E6A23C','#F56C6C','#909399','#B37FEB','#36CFC9','#F2A8B8','#79BBFF','#95D475','#FF9F43','#EE5A24','#0ABDE3','#A29BFE','#FD79A8']
function barColor(name: string) {
  let hash = 0; for (let i = 0; i < (name || '').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colorPalette[Math.abs(hash) % colorPalette.length]
}

function roleLabel(r: string) { const m: Record<string, string> = { teacher: '教师', group_leader: '教研组长', admin: '管理员', leader: '领导' }; return m[r] || r }
function roleType(r: string) { const m: Record<string, any> = { teacher: 'info', group_leader: 'warning', admin: 'danger', leader: 'success' }; return m[r] || 'info' }

function statusLabel(type: string, s: string) {
  const m: Record<string, Record<string, string>> = {
    plan: { draft: '草稿', published: '已发布', archived: '已归档' },
    activity: { planned: '计划中', ongoing: '进行中', ended: '已结束' },
    material: { pending: '待审核', approved: '已通过', rejected: '已驳回' },
    competition: { upcoming: '即将开始', ongoing: '进行中', ended: '已结束' },
    training: { planned: '计划中', ongoing: '进行中', ended: '已结束' },
  }
  return m[type]?.[s] || s
}
function statusTag(type: string, s: string) {
  const m: Record<string, Record<string, any>> = {
    plan: { draft: 'info', published: 'success', archived: 'warning' },
    activity: { planned: 'info', ongoing: 'warning', ended: 'success' },
    material: { pending: 'warning', approved: 'success', rejected: 'danger' },
    competition: { upcoming: 'info', ongoing: 'warning', ended: 'success' },
    training: { planned: 'info', ongoing: 'warning', ended: 'success' },
  }
  return m[type]?.[s] || 'info'
}
function statusColor(s: string) {
  const m: Record<string, string> = { pending: '#E6A23C', approved: '#67C23A', rejected: '#F56C6C' }
  return m[s] || '#909399'
}

/* ===== 初始化 ===== */
onMounted(async () => {
  const d = await statisticsApi.dashboard()
  cards.value = [
    { key: 'users', label: '教职工总数', value: d.totalStaff },
    { key: 'plans', label: '教研计划', value: d.planCount },
    { key: 'activities', label: '教研活动', value: d.activityCount },
    { key: 'materials', label: '教研材料', value: d.materialCount },
    { key: 'topics', label: '课题研究', value: d.topicCount },
    { key: 'competitions', label: '教师竞赛', value: d.competitionCount },
    { key: 'skillContests', label: '学生技能赛', value: d.skillContestCount },
    { key: 'trainings', label: '培训管理', value: d.trainingCount },
    { key: 'resources', label: '资源库', value: d.resourceCount },
  ]
  totalStaff.value = d.totalStaff

  // 加载概览的部门+角色分布
  overview.loading = true
  try {
    const users = await statisticsApi.users()
    overview.deptStats = users.deptStats
    overview.roleStats = users.roleStats
    overview.total = d.totalStaff
  } finally { overview.loading = false }
})
</script>

<style scoped>
.stat-card { text-align: center; position: relative; }
.stat-value { font-size: 36px; font-weight: 700; color: var(--el-color-primary); line-height: 1.2; }
.stat-label { font-size: 14px; color: var(--el-text-color-secondary); margin-top: 6px; }
.stat-hint { font-size: 12px; color: #bbb; margin-top: 8px; opacity: 0; transition: opacity 0.2s; }
.el-card:hover .stat-hint { opacity: 1; }
.is-active { border-color: var(--el-color-primary); box-shadow: 0 0 0 2px var(--el-color-primary-light-7); }
.stat-row { display: flex; align-items: center; gap: 12px; padding: 8px 0; flex-wrap: wrap; }
.stat-row-label { font-size: 13px; color: #333; min-width: 60px; }
.stat-row-count { font-size: 16px; font-weight: 700; color: var(--el-color-primary); min-width: 36px; text-align: center; }
.stat-row .el-progress { flex: 1; min-width: 80px; }
.summary-card { padding: 12px 0; }
.summary-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.summary-item:last-child { border-bottom: none; }
.summary-label { font-size: 14px; color: #333; }
.summary-value { font-size: 24px; font-weight: 700; }
</style>
