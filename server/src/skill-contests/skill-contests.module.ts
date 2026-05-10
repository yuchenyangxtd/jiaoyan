import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SkillContest } from './skill-contest.entity'
import { SkillContestsController } from './skill-contests.controller'
import { SkillContestsService } from './skill-contests.service'

@Module({
  imports: [TypeOrmModule.forFeature([SkillContest])],
  controllers: [SkillContestsController],
  providers: [SkillContestsService],
})
export class SkillContestsModule {}
