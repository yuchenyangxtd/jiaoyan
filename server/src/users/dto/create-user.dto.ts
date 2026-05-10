import { IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator'

export class CreateUserDto {
  @IsString()
  @MaxLength(50)
  username!: string

  @IsString()
  @MaxLength(100)
  real_name!: string

  @IsString()
  @MaxLength(255)
  password!: string

  @IsString()
  @MaxLength(20)
  role!: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string

  @IsOptional()
  @IsBoolean()
  is_active?: boolean
}
