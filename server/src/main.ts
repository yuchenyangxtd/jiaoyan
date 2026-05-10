import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // 全局路由前缀 /api
  app.setGlobalPrefix('api')

  // 启用 CORS（开发环境允许前端跨域访问）
  app.enableCors({ origin: true, credentials: true })

  // 全局参数校验
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  const port = process.env.SERVER_PORT || 3000
  await app.listen(port)
  console.log(`Server running on http://localhost:${port}/api`)
}
bootstrap()
