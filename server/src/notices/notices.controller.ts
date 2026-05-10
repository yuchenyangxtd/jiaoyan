import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common'
import { NoticesService } from './notices.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { CreateNoticeDto } from './dto/create-notice.dto'

@Controller('notices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NoticesController {
  constructor(private noticesService: NoticesService) {}

  @Get()
  async findAll() {
    return this.noticesService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.noticesService.findById(Number(id))
  }

  @Post()
  @Roles('admin', 'group_leader')
  async create(@Body() dto: CreateNoticeDto, @Req() req: any) {
    return this.noticesService.create({ ...dto, created_by: req.user.id })
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string) {
    await this.noticesService.delete(Number(id))
    return { message: '删除成功' }
  }
}
