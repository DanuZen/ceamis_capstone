import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(['pemasukan', 'pengeluaran'])
  type: 'pemasukan' | 'pengeluaran';

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsEnum(['needs', 'wants'])
  tag?: 'needs' | 'wants';
}
