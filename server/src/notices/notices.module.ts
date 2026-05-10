import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NoticesController } from './notices.controller'
import { NoticesService } from './notices.service'
import { Notice } from './notice.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Notice])],
  controllers: [NoticesController],
  providers: [NoticesService],
})
export class NoticesModule {}
