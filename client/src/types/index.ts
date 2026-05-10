// 用户类型：与 Supabase auth.users + public.users 对应
export interface UserProfile {
  id: string // UUID
  username: string
  real_name: string
  role: 'teacher' | 'group_leader' | 'admin' | 'leader'
  department: string | null
  is_active: boolean
  created_at: string
}

// 教研计划
export interface Plan {
  id: number
  title: string
  content: string | null
  semester: string
  department: string | null
  status: 'draft' | 'published' | 'archived'
  created_by: string // UUID
  created_at: string
  updated_at: string
}

// 教研活动
export interface Activity {
  id: number
  title: string
  description: string | null
  date: string | null
  location: string | null
  type: string | null
  status: string
  created_by: string
  created_at: string
  updated_at: string
}

// 材料提交
export interface Material {
  id: number
  title: string
  file_url: string | null
  description: string | null
  status: 'pending' | 'approved' | 'rejected'
  comment: string | null
  submitter_id: string
  reviewer_id: string | null
  created_at: string
  updated_at: string
}

// 通知公告
export interface Notice {
  id: number
  title: string
  content: string | null
  is_pinned: boolean
  created_by: string
  created_at: string
  updated_at: string
}

// 课题研究
export interface Topic {
  id: number
  title: string
  type: string
  content: string | null
  status: 'draft' | 'published'
  created_by: string
  created_at: string
  updated_at: string
}

// 教师竞赛
export interface Competition {
  id: number
  title: string
  description: string | null
  deadline: string | null
  status: 'upcoming' | 'ongoing' | 'ended'
  created_by: string
  created_at: string
  updated_at: string
}

// 学生技能赛
export interface SkillContest {
  id: number
  title: string
  description: string | null
  contest_date: string | null
  level: '校级' | '区级' | '市级' | '省级' | '国家级' | null
  status: 'upcoming' | 'ongoing' | 'ended'
  created_by: string
  created_at: string
  updated_at: string
}

// 培训管理
export interface Training {
  id: number
  title: string
  description: string | null
  start_date: string | null
  end_date: string | null
  location: string | null
  status: 'planned' | 'ongoing' | 'ended'
  created_by: string
  created_at: string
  updated_at: string
}

// 资源库
export interface Resource {
  id: number
  title: string
  type: string
  description: string | null
  file_url: string | null
  tags: string | null
  download_count: number
  created_by: string
  created_at: string
  updated_at: string
}

// 统计数据
export interface StatItem {
  name: string
  count: number
}

export interface DashboardStats {
  totalStaff: number
  planCount: number
  activityCount: number
  materialCount: number
  topicCount: number
  competitionCount: number
  skillContestCount: number
  trainingCount: number
  resourceCount: number
}

export interface UsersDetail {
  deptStats: StatItem[]
  roleStats: StatItem[]
}

export interface PlansDetail {
  byStatus: StatItem[]
  byDept: StatItem[]
  bySemester: StatItem[]
  recent: Plan[]
}

export interface ActivitiesDetail {
  byType: StatItem[]
  byStatus: StatItem[]
  recent: Activity[]
}

export interface MaterialsDetail {
  byStatus: StatItem[]
  recent: Material[]
}

export interface TopicsDetail {
  byType: StatItem[]
  byStatus: StatItem[]
  recent: Topic[]
}

export interface CompetitionsDetail {
  byStatus: StatItem[]
  recent: Competition[]
}

export interface SkillContestsDetail {
  byLevel: StatItem[]
  byStatus: StatItem[]
  recent: SkillContest[]
}

export interface TrainingsDetail {
  byStatus: StatItem[]
  recent: Training[]
}

export interface ResourcesDetail {
  byType: StatItem[]
  totalDownloads: number
  recent: Resource[]
}
