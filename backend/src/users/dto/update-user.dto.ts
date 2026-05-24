import { IsString, IsEmail, IsOptional, IsNumber, IsArray, Min, Max } from 'class-validator';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar_url?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  health_score?: number;

  @IsOptional()
  @IsNumber()
  level?: number;

  @IsOptional()
  @IsNumber()
  xp?: number;

  @IsOptional()
  @IsNumber()
  streak?: number;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  unlocked_badges?: string[];
}
