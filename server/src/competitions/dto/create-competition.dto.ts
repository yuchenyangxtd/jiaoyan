import { IsString, IsOptional, IsDateString, MaxLength } from 'class-validator'

export class CreateCompetitionDto {
  @IsString()
  @MaxLength(200)
  title!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsDateString()
  deadline?: string

  @IsOptional()
  @IsString()
  @MaxLength(10)
  status?: string
}
