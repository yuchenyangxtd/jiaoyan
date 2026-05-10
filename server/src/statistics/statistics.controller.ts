import { Controller, Get, UseGuards } from '@nestjs/common'
import { StatisticsService } from './statistics.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('statistics')
@UseGuards(JwtAuthGuard)
export class StatisticsController {
  constructor(private service: StatisticsService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.service.getDashboard()
  }

  @Get('users')
  async getUsers() {
    return this.service.getUsersDetail()
  }

  @Get('plans')
  async getPlans() {
    return this.service.getPlansDetail()
  }

  @Get('activities')
  async getActivities() {
    return this.service.getActivitiesDetail()
  }

  @Get('materials')
  async getMaterials() {
    return this.service.getMaterialsDetail()
  }

  @Get('topics')
  async getTopics() {
    return this.service.getTopicsDetail()
  }

  @Get('competitions')
  async getCompetitions() {
    return this.service.getCompetitionsDetail()
  }

  @Get('skill-contests')
  async getSkillContests() {
    return this.service.getSkillContestsDetail()
  }

  @Get('trainings')
  async getTrainings() {
    return this.service.getTrainingsDetail()
  }

  @Get('resources')
  async getResources() {
    return this.service.getResourcesDetail()
  }
}
