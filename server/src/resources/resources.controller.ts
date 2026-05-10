import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common'
import { ResourcesService } from './resources.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { CreateResourceDto } from './dto/create-resource.dto'
import { UpdateResourceDto } from './dto/update-resource.dto'

@Controller('resources')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResourcesController {
  constructor(private service: ResourcesService) {}

  @Get()
  async findAll() { return this.service.findAll() }

  @Get(':id')
  async findOne(@Param('id') id: string) { return this.service.findById(Number(id)) }

  @Post()
  @Roles('admin', 'group_leader')
  async create(@Body() dto: CreateResourceDto, @Req() req: any) {
    return this.service.create({ ...dto, created_by: req.user.id })
  }

  @Patch(':id')
  @Roles('admin', 'group_leader')
  async update(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
    return this.service.update(Number(id), dto)
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string) {
    await this.service.delete(Number(id))
    return { message: '删除成功' }
  }
}
