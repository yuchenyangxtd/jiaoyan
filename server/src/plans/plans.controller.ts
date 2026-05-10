import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common'
import { PlansService } from './plans.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { CreatePlanDto } from './dto/create-plan.dto'
import { UpdatePlanDto } from './dto/update-plan.dto'

@Controller('plans')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Get()
  async findAll() {
    return this.plansService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.plansService.findById(Number(id))
  }

  @Post()
  @Roles('admin', 'group_leader')
  async create(@Body() dto: CreatePlanDto, @Req() req: any) {
    return this.plansService.create({ ...dto, created_by: req.user.id })
  }

  @Patch(':id')
  @Roles('admin', 'group_leader')
  async update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.plansService.update(Number(id), dto)
  }

  @Delete(':id')
  @Roles('admin')
  async delete(@Param('id') id: string) {
    await this.plansService.delete(Number(id))
    return { message: '删除成功' }
  }
}
