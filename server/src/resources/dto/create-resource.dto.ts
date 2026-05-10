import { IsString, IsOptional, MaxLength } from 'class-validator'

export class CreateResourceDto {
  @IsString()
  @MaxLength(200)
  title!: string

  @IsString()
  @MaxLength(50)
  type!: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  file_url?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  tags?: string
}
