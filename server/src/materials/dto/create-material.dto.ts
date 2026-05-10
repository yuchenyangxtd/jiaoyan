import { IsString, IsOptional, MaxLength } from 'class-validator'

export class CreateMaterialDto {
  @IsString()
  @MaxLength(200)
  title!: string

  @IsOptional()
  @IsString()
  @MaxLength(500)
  file_url?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  comment?: string
}
