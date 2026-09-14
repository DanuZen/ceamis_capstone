import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ParseReceiptDto {
  @IsNotEmpty({ message: 'raw_text tidak boleh kosong' })
  @IsString({ message: 'raw_text harus berupa string' })
  raw_text: string;

  @IsOptional()
  @IsString({ message: 'image_url harus berupa string' })
  image_url?: string;

  @IsOptional()
  @IsString({ message: 'user_id harus berupa string' })
  user_id?: string;
}
