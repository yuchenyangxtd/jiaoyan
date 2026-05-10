import { IsString, IsOptional, IsDateString, MaxLength } from 'class-validator'

export class CreateSkillContestDto {
  @IsString()
  @MaxLength(200)
  title!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsDateString()
  contest_date?: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  level?: string

  @IsOptional()
  @IsString()
  @MaxLength(10)
  status?: string
}
