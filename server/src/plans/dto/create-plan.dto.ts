import { IsString, IsOptional, MaxLength } from 'class-validator'

export class CreatePlanDto {
  @IsString()
  @MaxLength(200)
  title!: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  semester?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string

  @IsOptional()
  @IsString()
  content?: string

  @IsOptional()
  @IsString()
  @MaxLength(10)
  status?: string
}
