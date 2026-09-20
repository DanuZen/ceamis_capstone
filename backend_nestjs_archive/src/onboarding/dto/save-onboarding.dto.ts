import {
  IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional,
  IsArray, IsPositive, Min, Max, IsBoolean
} from 'class-validator';

export class SaveOnboardingDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(10)
  @Max(100)
  age: number;

  @IsNumber()
  @IsPositive()
  income: number;

  @IsEnum(['gaji', 'freelance', 'bisnis', 'uang_saku'])
  income_source: string;

  @IsArray()
  @IsString({ each: true })
  top_expenses: string[];

  @IsNumber()
  @IsPositive()
  monthly_expense: number;

  @IsArray()
  @IsString({ each: true })
  goals: string[];

  @IsEnum(['konservatif', 'moderat', 'agresif'])
  @IsOptional() // Make optional since we are deriving it in frontend now, or keep it if we still send a default
  risk_profile: string;

  // Model 3 Features
  @IsNumber()
  @IsOptional()
  tanggungan_keluarga: number;

  @IsNumber()
  @IsOptional()
  city_tier_enc: number;

  @IsNumber()
  @IsOptional()
  toleransi_rugi_enc: number;

  @IsNumber()
  @IsOptional()
  save_habit: number;

  @IsBoolean()
  @IsOptional()
  punya_tabungan: boolean;

  @IsNumber()
  @IsOptional()
  jumlah_tabungan_bulan: number;
}
