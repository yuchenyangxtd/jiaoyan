import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from './config.module'
import { ConfigService } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { PlansModule } from './plans/plans.module'
import { ActivitiesModule } from './activities/activities.module'
import { MaterialsModule } from './materials/materials.module'
import { NoticesModule } from './notices/notices.module'
import { TopicsModule } from './topics/topics.module'
import { CompetitionsModule } from './competitions/competitions.module'
import { SkillContestsModule } from './skill-contests/skill-contests.module'
import { TrainingsModule } from './trainings/trainings.module'
import { ResourcesModule } from './resources/resources.module'
import { StatisticsModule } from './statistics/statistics.module'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get('DB_PORT', 3306),
        username: config.get('DB_USER', 'root'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_NAME', 'jiaoyan_system'),
        autoLoadEntities: true,
        synchronize: config.get('NODE_ENV') !== 'production',
      }),
    }),
    AuthModule,
    UsersModule,
    PlansModule,
    ActivitiesModule,
    MaterialsModule,
    NoticesModule,
    TopicsModule,
    CompetitionsModule,
    SkillContestsModule,
    TrainingsModule,
    ResourcesModule,
    StatisticsModule,
  ],
})
export class AppModule {}
