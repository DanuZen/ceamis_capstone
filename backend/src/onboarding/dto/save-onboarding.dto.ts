import {
  IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional,
  IsArray, IsPositive, Min, Max,
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
  risk_profile: string;
}
