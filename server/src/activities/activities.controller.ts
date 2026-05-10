import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common'
import { ActivitiesService } from './activities.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { CreateActivityDto } from './dto/create-activity.dto'
import { UpdateActivityDto } from './dto/update-activity.dto'

@Controller('activities')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}

  @Get()
  async findAll() {
    return this.activitiesService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.activitiesService.findById(Number(id))
  }

  @Post()
  @Roles('admin', 'group_leader')
  async create(@Body() dto: CreateActivityDto, @Req() req: any) {
    return this.activitiesService.create({ ...dto, created_by: req.user.id })
  }

  @Patch(':id')
  @Roles('admin', 'group_leader')
  async update(@Param('id') id: string, @Body() dto: UpdateActivityDto) {
    return this.activitiesService.update(Number(id), dto)
  }
}
