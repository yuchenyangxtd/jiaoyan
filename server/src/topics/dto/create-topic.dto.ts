import { IsString, IsOptional, MaxLength } from 'class-validator'

export class CreateTopicDto {
  @IsString()
  @MaxLength(200)
  title!: string

  @IsString()
  @MaxLength(50)
  type!: string

  @IsOptional()
  @IsString()
  content?: string

  @IsOptional()
  @IsString()
  @MaxLength(10)
  status?: string
}
