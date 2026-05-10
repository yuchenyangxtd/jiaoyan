import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Plan } from './plan.entity'

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private planRepo: Repository<Plan>,
  ) {}

  async findAll() {
    return this.planRepo.find({ order: { created_at: 'DESC' } })
  }

  async findById(id: number) {
    const plan = await this.planRepo.findOne({ where: { id } })
    if (!plan) throw new NotFoundException('计划不存在')
    return plan
  }

  async create(data: Partial<Plan>) {
    const plan = this.planRepo.create(data)
    return this.planRepo.save(plan)
  }

  async update(id: number, data: Partial<Plan>) {
    await this.findById(id)
    await this.planRepo.update(id, data)
    return this.findById(id)
  }

  async delete(id: number) {
    await this.findById(id)
    await this.planRepo.delete(id)
  }
}
