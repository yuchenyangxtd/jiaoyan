import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator'

export class CreateNoticeDto {
  @IsString()
  @MaxLength(200)
  title!: string

  @IsOptional()
  @IsString()
  content?: string

  @IsOptional()
  @IsBoolean()
  is_pinned?: boolean
}
