import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Plan } from '../plans/plan.entity'
import { Activity } from '../activities/activity.entity'
import { Material } from '../materials/material.entity'
import { User } from '../users/user.entity'
import { Topic } from '../topics/topic.entity'
import { Competition } from '../competitions/competition.entity'
import { SkillContest } from '../skill-contests/skill-contest.entity'
import { Training } from '../trainings/training.entity'
import { Resource } from '../resources/resource.entity'
import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'

@Module({
  imports: [TypeOrmModule.forFeature([Plan, Activity, Material, User, Topic, Competition, SkillContest, Training, Resource])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
