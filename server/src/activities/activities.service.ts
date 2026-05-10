import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Activity } from './activity.entity'

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private activityRepo: Repository<Activity>,
  ) {}

  async findAll() {
    return this.activityRepo.find({ order: { created_at: 'DESC' } })
  }

  async findById(id: number) {
    const activity = await this.activityRepo.findOne({ where: { id } })
    if (!activity) throw new NotFoundException('活动不存在')
    return activity
  }

  async create(data: Partial<Activity>) {
    const activity = this.activityRepo.create(data)
    return this.activityRepo.save(activity)
  }

  async update(id: number, data: Partial<Activity>) {
    await this.findById(id)
    await this.activityRepo.update(id, data)
    return this.findById(id)
  }
}
