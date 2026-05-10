import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Req } from '@nestjs/common'
import { MaterialsService } from './materials.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { CreateMaterialDto } from './dto/create-material.dto'
import { UpdateMaterialDto } from './dto/update-material.dto'

@Controller('materials')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaterialsController {
  constructor(private materialsService: MaterialsService) {}

  @Get()
  async findAll(@Query('submitter_id') submitterId?: string) {
    return this.materialsService.findAll(submitterId)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.materialsService.findById(Number(id))
  }

  @Post()
  @Roles('admin', 'group_leader')
  async create(@Body() dto: CreateMaterialDto, @Req() req: any) {
    return this.materialsService.create({ ...dto, submitter_id: req.user.id })
  }

  @Patch(':id')
  @Roles('admin', 'group_leader')
  async update(@Param('id') id: string, @Body() dto: UpdateMaterialDto) {
    return this.materialsService.update(Number(id), dto)
  }
}
