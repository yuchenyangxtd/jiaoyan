import { IsString, IsOptional, IsDateString, MaxLength } from 'class-validator'

export class CreateTrainingDto {
  @IsString()
  @MaxLength(200)
  title!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsDateString()
  start_date?: string

  @IsOptional()
  @IsDateString()
  end_date?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string

  @IsOptional()
  @IsString()
  @MaxLength(10)
  status?: string
}
