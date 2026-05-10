import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Resource } from './resource.entity'

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private repo: Repository<Resource>,
  ) {}

  async findAll() {
    return this.repo.find({ order: { created_at: 'DESC' } })
  }

  async findById(id: number) {
    const item = await this.repo.findOne({ where: { id } })
    if (!item) throw new NotFoundException('资源不存在')
    return item
  }

  async create(data: Partial<Resource>) {
    const item = this.repo.create(data)
    return this.repo.save(item)
  }

  async update(id: number, data: Partial<Resource>) {
    await this.findById(id)
    await this.repo.update(id, data)
    return this.findById(id)
  }

  async delete(id: number) {
    await this.findById(id)
    await this.repo.delete(id)
  }
}
