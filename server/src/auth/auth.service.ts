import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { User } from '../users/user.entity'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { username, is_active: true },
      select: ['id', 'username', 'password_hash', 'real_name', 'role', 'department', 'is_active', 'created_at'],
    })

    if (!user) throw new UnauthorizedException('账号或密码错误')

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) throw new UnauthorizedException('账号或密码错误')

    const payload = { sub: user.id, username: user.username, role: user.role }
    const token = this.jwtService.sign(payload)

    const { password_hash, ...safeUser } = user
    return { token, user: safeUser }
  }
}
