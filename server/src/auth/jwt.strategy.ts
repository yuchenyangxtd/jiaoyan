import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { User } from '../users/user.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    })
  }

  async validate(payload: { sub: string; username: string; role: string }) {
    const user = await this.userRepo.findOne({
      where: { id: payload.sub, is_active: true },
    })
    if (!user) throw new UnauthorizedException('用户不存在或已禁用')
    // 挂载到 request.user
    return { id: user.id, username: user.username, role: user.role, real_name: user.real_name, department: user.department }
  }
}
