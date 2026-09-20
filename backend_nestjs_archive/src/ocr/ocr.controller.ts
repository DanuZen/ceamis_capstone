import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OcrService, ParsedReceiptResult } from './ocr.service';
import { ParseReceiptDto } from './dto/parse-receipt.dto';

@Controller('api/v1/ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('parse-receipt')
  @HttpCode(HttpStatus.OK)
  async parseReceipt(@Body() dto: ParseReceiptDto): Promise<{
    status: string;
    message: string;
    data: ParsedReceiptResult;
  }> {
    const data = await this.ocrService.parseReceipt(dto);

    return {
      status: 'success',
      message: data.is_mock
        ? 'Ekstraksi struk berhasil menggunakan metode heuristic fallback'
        : 'Ekstraksi struk berhasil menggunakan Gemini 2.0 Flash',
      data,
    };
  }
}
