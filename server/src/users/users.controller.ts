import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { RolesGuard } from '../auth/roles.guard'
import { Roles } from '../auth/roles.decorator'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles('admin')
  async findAll() {
    return this.usersService.findAll()
  }

  @Get('me')
  async getProfile(@Req() req: any) {
    return this.usersService.findById(req.user.id)
  }

  @Get(':id')
  @Roles('admin')
  async findOne(@Param('id') id: string) {
    return this.usersService.findById(id)
  }

  @Post()
  @Roles('admin')
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto)
  }

  @Patch(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto)
  }

  /** Excel 批量导入 */
  @Post('import')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async importExcel(@UploadedFile() file: Express.Multer.File, @Body('password') password?: string) {
    if (!file) throw new BadRequestException('请上传 Excel 文件')
    return this.usersService.importFromExcel(file, password || '123456')
  }

  /** 批量删除 */
  @Post('batch-delete')
  @Roles('admin')
  async batchDelete(@Body() body: { ids: string[] }) {
    if (!body.ids || body.ids.length === 0) throw new BadRequestException('请选择要删除的用户')
    return this.usersService.bulkDelete(body.ids)
  }

  /** 批量更新 */
  @Post('batch-update')
  @Roles('admin')
  async batchUpdate(@Body() body: { ids: string[]; data: { role?: string; department?: string; is_active?: boolean } }) {
    if (!body.ids || body.ids.length === 0) throw new BadRequestException('请选择要更新的用户')
    return this.usersService.bulkUpdate(body.ids, body.data)
  }
}
