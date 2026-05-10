import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common'
import { TrainingsService } from './trainings.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { CreateTrainingDto } from './dto/create-training.dto'
import { UpdateTrainingDto } from './dto/update-training.dto'

@Controller('trainings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TrainingsController {
  constructor(private service: TrainingsService) {}

  @Get()
  async findAll() { return this.service.findAll() }

  @Get(':id')
  async findOne(@Param('id') id: string) { return this.service.findById(Number(id)) }

  @Post()
  @Roles('admin', 'group_leader')
  async create(@Body() dto: CreateTrainingDto, @Req() req: any) {
    return this.service.create({ ...dto, created_by: req.user.id })
  }

  @Patch(':id')
  @Roles('admin', 'group_leader')
  async update(@Param('id') id: string, @Body() dto: UpdateTrainingDto) {
    return this.service.update(Number(id), dto)
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string) {
    await this.service.delete(Number(id))
    return { message: '删除成功' }
  }
}
