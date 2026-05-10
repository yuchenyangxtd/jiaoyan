import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Notice } from './notice.entity'

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice)
    private noticeRepo: Repository<Notice>,
  ) {}

  async findAll() {
    return this.noticeRepo.find({ order: { is_pinned: 'DESC', created_at: 'DESC' } })
  }

  async findById(id: number) {
    const notice = await this.noticeRepo.findOne({ where: { id } })
    if (!notice) throw new NotFoundException('通知不存在')
    return notice
  }

  async create(data: Partial<Notice>) {
    const notice = this.noticeRepo.create(data)
    return this.noticeRepo.save(notice)
  }

  async delete(id: number) {
    await this.findById(id)
    await this.noticeRepo.delete(id)
  }
}
