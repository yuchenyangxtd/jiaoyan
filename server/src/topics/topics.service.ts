import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Topic } from './topic.entity'

@Injectable()
export class TopicsService {
  constructor(
    @InjectRepository(Topic)
    private repo: Repository<Topic>,
  ) {}

  async findAll() {
    return this.repo.find({ order: { created_at: 'DESC' } })
  }

  async findById(id: number) {
    const item = await this.repo.findOne({ where: { id } })
    if (!item) throw new NotFoundException('课题不存在')
    return item
  }

  async create(data: Partial<Topic>) {
    const item = this.repo.create(data)
    return this.repo.save(item)
  }

  async update(id: number, data: Partial<Topic>) {
    await this.findById(id)
    await this.repo.update(id, data)
    return this.findById(id)
  }

  async delete(id: number) {
    await this.findById(id)
    await this.repo.delete(id)
  }
}
