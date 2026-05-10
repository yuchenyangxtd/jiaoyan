import { Injectable, ConflictException, NotFoundException, BadRequestException, OnApplicationBootstrap } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import * as XLSX from 'xlsx'
import { User } from './user.entity'

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedIfEmpty()
  }

  async findAll() {
    return this.userRepo.find({ order: { created_at: 'DESC' } })
  }

  async findById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } })
    if (!user) throw new NotFoundException('用户不存在')
    return user
  }

  async findByUsername(username: string) {
    return this.userRepo.findOne({ where: { username } })
  }

  async create(data: { username: string; password: string; real_name: string; role: string; department?: string }) {
    const existing = await this.userRepo.findOne({ where: { username: data.username } })
    if (existing) throw new ConflictException(`工号 ${data.username} 已存在`)

    const password_hash = await bcrypt.hash(data.password, 10)
    const user = this.userRepo.create({
      username: data.username,
      password_hash,
      real_name: data.real_name,
      role: data.role,
      department: data.department || null,
    })
    return this.userRepo.save(user)
  }

  async update(id: string, data: Partial<Omit<User, 'password_hash'>> & { password?: string }) {
    const user = await this.findById(id)
    if (data.password) {
      user['password_hash'] = await bcrypt.hash(data.password, 10)
    }
    const allowed = ['real_name', 'role', 'department', 'is_active']
    for (const key of allowed) {
      if ((data as any)[key] !== undefined) {
        (user as any)[key] = (data as any)[key]
      }
    }
    return this.userRepo.save(user)
  }

  /** 批量导入：从 Excel 文件解析并创建用户 */
  async importFromExcel(file: Express.Multer.File, defaultPassword: string = '123456') {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' })
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json<any>(sheet, { header: 1 })

    if (rows.length < 2) {
      throw new BadRequestException('Excel 文件为空或只有表头')
    }

    // 解析表头（第1行）
    const headers = rows[0] as string[]
    const colMap: Record<string, number> = {}
    headers.forEach((h: string, i: number) => {
      const key = String(h || '').trim()
      if (key.includes('工号') || key.includes('账号')) colMap['username'] = i
      else if (key.includes('姓名') || key.includes('名字')) colMap['real_name'] = i
      else if (key.includes('部门') || key.includes('院系') || key.includes('专业')) colMap['department'] = i
      else if (key.includes('角色')) colMap['role'] = i
    })

    if (colMap['username'] === undefined) throw new BadRequestException('Excel 缺少"工号"列')
    if (colMap['real_name'] === undefined) throw new BadRequestException('Excel 缺少"姓名"列')

    const roleMap: Record<string, string> = {
      '校领导': 'leader', '领导': 'leader', '校长': 'leader',
      '管理员': 'admin', '教务': 'admin',
    }

    const results = { total: 0, success: 0, failed: 0, errors: [] as string[] }

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (!row || !row[colMap['username']]) continue

      results.total++
      const username = String(row[colMap['username']]).trim()
      const real_name = String(row[colMap['real_name']] || '').trim()
      const department = colMap['department'] !== undefined ? String(row[colMap['department']] || '').trim() : null
      const rawRole = colMap['role'] !== undefined && row[colMap['role']] ? String(row[colMap['role']]).trim() : null

      let role = 'teacher'
      if (rawRole && roleMap[rawRole]) {
        role = roleMap[rawRole]
      } else if (department && roleMap[department]) {
        role = roleMap[department]
      }

      try {
        await this.create({ username, real_name, role, department: department || undefined, password: defaultPassword })
        results.success++
      } catch (e: any) {
        results.failed++
        results.errors.push(`第 ${i + 1} 行 ${username} ${real_name}: ${e.message}`)
      }
    }

    return results
  }

  /** 批量创建用户 */
  async bulkCreate(users: { username: string; password: string; real_name: string; role: string; department?: string }[]) {
    const results = { total: users.length, success: 0, failed: 0, errors: [] as string[] }
    for (const u of users) {
      try {
        await this.create(u)
        results.success++
      } catch (e: any) {
        results.failed++
        results.errors.push(`${u.username} ${u.real_name}: ${e.message}`)
      }
    }
    return results
  }

  /** 批量删除 */
  async bulkDelete(ids: string[]) {
    const users = await this.userRepo.find({ where: { id: In(ids) } })
    if (users.length === 0) throw new NotFoundException('未找到要删除的用户')
    await this.userRepo.remove(users)
    return { deleted: users.length }
  }

  /** 批量更新 */
  async bulkUpdate(ids: string[], data: { role?: string; department?: string; is_active?: boolean }) {
    const users = await this.userRepo.find({ where: { id: In(ids) } })
    if (users.length === 0) throw new NotFoundException('未找到要更新的用户')
    for (const user of users) {
      if (data.role !== undefined) (user as any).role = data.role
      if (data.department !== undefined) (user as any).department = data.department
      if (data.is_active !== undefined) (user as any).is_active = data.is_active
    }
    await this.userRepo.save(users)
    return { updated: users.length }
  }

  // 种子数据
  async seedIfEmpty() {
    const count = await this.userRepo.count()
    if (count > 0) return

    const users = [
      { username: 'admin', password: 'admin123', real_name: '系统管理员', role: 'admin', department: '教务处' },
      { username: 'zhanglao', password: '123456', real_name: '张组长', role: 'group_leader', department: '计算机部' },
      { username: 'wanglaoshi', password: '123456', real_name: '王老师', role: 'teacher', department: '计算机部' },
    ]
    for (const u of users) {
      await this.create(u)
    }
    console.log('✅ 已创建 3 个默认用户')
  }
}
