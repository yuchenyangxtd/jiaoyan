import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Plan } from '../plans/plan.entity'
import { Activity } from '../activities/activity.entity'
import { Material } from '../materials/material.entity'
import { User } from '../users/user.entity'
import { Topic } from '../topics/topic.entity'
import { Competition } from '../competitions/competition.entity'
import { SkillContest } from '../skill-contests/skill-contest.entity'
import { Training } from '../trainings/training.entity'
import { Resource } from '../resources/resource.entity'

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Plan) private planRepo: Repository<Plan>,
    @InjectRepository(Activity) private activityRepo: Repository<Activity>,
    @InjectRepository(Material) private materialRepo: Repository<Material>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Topic) private topicRepo: Repository<Topic>,
    @InjectRepository(Competition) private competitionRepo: Repository<Competition>,
    @InjectRepository(SkillContest) private skillContestRepo: Repository<SkillContest>,
    @InjectRepository(Training) private trainingRepo: Repository<Training>,
    @InjectRepository(Resource) private resourceRepo: Repository<Resource>,
  ) {}

  async getDashboard() {
    const [planCount, activityCount, materialCount, totalStaff, topicCount, competitionCount, skillContestCount, trainingCount, resourceCount] = await Promise.all([
      this.planRepo.count(),
      this.activityRepo.count(),
      this.materialRepo.count(),
      this.userRepo.count(),
      this.topicRepo.count(),
      this.competitionRepo.count(),
      this.skillContestRepo.count(),
      this.trainingRepo.count(),
      this.resourceRepo.count(),
    ])

    return { planCount, activityCount, materialCount, totalStaff, topicCount, competitionCount, skillContestCount, trainingCount, resourceCount }
  }

  async getUsersDetail() {
    const [deptStats, roleStats] = await Promise.all([
      this.groupBy(this.userRepo, 'department', '未设置'),
      this.groupBy(this.userRepo, 'role', 'unknown'),
    ])
    return { deptStats, roleStats }
  }

  async getPlansDetail() {
    const [byStatus, byDept, bySemester] = await Promise.all([
      this.groupBy(this.planRepo, 'status', 'unknown'),
      this.groupBy(this.planRepo, 'department', '未设置'),
      this.groupBy(this.planRepo, 'semester', '未知'),
    ])
    const recent = await this.planRepo.find({ order: { created_at: 'DESC' }, take: 10 })
    return { byStatus, byDept, bySemester, recent }
  }

  async getActivitiesDetail() {
    const [byType, byStatus] = await Promise.all([
      this.groupBy(this.activityRepo, 'type', '其他'),
      this.groupBy(this.activityRepo, 'status', 'unknown'),
    ])
    const recent = await this.activityRepo.find({ order: { created_at: 'DESC' }, take: 10 })
    return { byType, byStatus, recent }
  }

  async getMaterialsDetail() {
    const byStatus = await this.groupBy(this.materialRepo, 'status', 'unknown')
    const recent = await this.materialRepo.find({ order: { created_at: 'DESC' }, take: 10 })
    return { byStatus, recent }
  }

  async getTopicsDetail() {
    const [byType, byStatus] = await Promise.all([
      this.groupBy(this.topicRepo, 'type', '其他'),
      this.groupBy(this.topicRepo, 'status', 'unknown'),
    ])
    const recent = await this.topicRepo.find({ order: { created_at: 'DESC' }, take: 10 })
    return { byType, byStatus, recent }
  }

  async getCompetitionsDetail() {
    const byStatus = await this.groupBy(this.competitionRepo, 'status', 'unknown')
    const recent = await this.competitionRepo.find({ order: { created_at: 'DESC' }, take: 10 })
    return { byStatus, recent }
  }

  async getSkillContestsDetail() {
    const [byLevel, byStatus] = await Promise.all([
      this.groupBy(this.skillContestRepo, 'level', '未设置'),
      this.groupBy(this.skillContestRepo, 'status', 'unknown'),
    ])
    const recent = await this.skillContestRepo.find({ order: { created_at: 'DESC' }, take: 10 })
    return { byLevel, byStatus, recent }
  }

  async getTrainingsDetail() {
    const byStatus = await this.groupBy(this.trainingRepo, 'status', 'unknown')
    const recent = await this.trainingRepo.find({ order: { created_at: 'DESC' }, take: 10 })
    return { byStatus, recent }
  }

  async getResourcesDetail() {
    const [byType, totalResult] = await Promise.all([
      this.groupBy(this.resourceRepo, 'type', '其他'),
      this.resourceRepo.createQueryBuilder('r').select('SUM(r.download_count)', 'total').getRawOne(),
    ])
    const recent = await this.resourceRepo.find({ order: { created_at: 'DESC' }, take: 10 })
    return { byType, totalDownloads: Number(totalResult?.total || 0), recent }
  }

  private async groupBy(repo: Repository<any>, column: string, fallback: string) {
    const rows = await repo.createQueryBuilder('t')
      .select(`t.${column}`, 'name')
      .addSelect('COUNT(*)', 'count')
      .groupBy(`t.${column}`)
      .orderBy('COUNT(*)', 'DESC')
      .getRawMany()
    return rows.map((r: any) => ({ name: r.name || fallback, count: Number(r.count) }))
  }
}
