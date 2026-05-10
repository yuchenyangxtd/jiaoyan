import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Material } from './material.entity'

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(Material)
    private materialRepo: Repository<Material>,
  ) {}

  async findAll(submitterId?: string) {
    const where: any = {}
    if (submitterId) where.submitter_id = submitterId
    return this.materialRepo.find({ where, order: { created_at: 'DESC' } })
  }

  async findById(id: number) {
    const material = await this.materialRepo.findOne({ where: { id } })
    if (!material) throw new NotFoundException('材料不存在')
    return material
  }

  async create(data: Partial<Material>) {
    const material = this.materialRepo.create(data)
    return this.materialRepo.save(material)
  }

  async update(id: number, data: Partial<Material>) {
    await this.findById(id)
    await this.materialRepo.update(id, data)
    return this.findById(id)
  }
}
