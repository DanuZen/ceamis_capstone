import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { OcrService } from './ocr.service';
import { OcrController } from './ocr.controller';

describe('OcrModule', () => {
  let service: OcrService;
  let controller: OcrController;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OcrController],
      providers: [
        OcrService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'GEMINI_API_KEY') return 'test_gemini_api_key';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<OcrService>(OcrService);
    controller = module.get<OcrController>(OcrController);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });

  describe('parseReceipt with Gemini API mock', () => {
    it('should parse raw receipt text using Gemini API response', async () => {
      const mockGeminiResponseBody = {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    merchant_name: 'Indomaret Utama',
                    transaction_date: '2026-09-14',
                    category: 'Groceries',
                    total_amount: 45000,
                    payment_method: 'QRIS',
                    items: [
                      { name: 'Susu UHT 1L', qty: 1, price: 20000, total: 20000 },
                      { name: 'Roti Tawar', qty: 1, price: 25000, total: 25000 },
                    ],
                    auto_tag: 'needs',
                    confidence_score: 0.98,
                  }),
                },
              ],
            },
          },
        ],
      };

      jest.spyOn(httpService, 'post').mockReturnValue(
        of({
          data: mockGeminiResponseBody,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as any,
        }),
      );

      const result = await service.parseReceipt({
        raw_text: 'INDOMARET UTAMA\n14/09/2026\nSusu UHT 20000\nRoti Tawar 25000\nTOTAL 45000\nQRIS',
      });

      expect(result.merchant_name).toBe('Indomaret Utama');
      expect(result.total_amount).toBe(45000);
      expect(result.category).toBe('Groceries');
      expect(result.payment_method).toBe('QRIS');
      expect(result.items).toHaveLength(2);
      expect(result.auto_tag).toBe('needs');
      expect(result.confidence_score).toBe(0.98);
      expect(result.is_mock).toBe(false);
    });

    it('should fallback gracefully when raw_text is empty or API fails', async () => {
      const result = await service.parseReceipt({
        raw_text: '',
      });

      expect(result.merchant_name).toBe('Merchant Tidak Terdeteksi');
      expect(result.is_mock).toBe(true);
    });
  });

  describe('OcrController', () => {
    it('should return API response format with status success', async () => {
      const mockResult = {
        merchant_name: 'Alfamart',
        transaction_date: '2026-09-14',
        category: 'Groceries',
        total_amount: 15000,
        payment_method: 'Cash',
        items: [],
        auto_tag: 'needs' as const,
        confidence_score: 0.9,
        is_mock: false,
      };

      jest.spyOn(service, 'parseReceipt').mockResolvedValue(mockResult);

      const response = await controller.parseReceipt({
        raw_text: 'ALFAMART TOTAL 15000',
      });

      expect(response.status).toBe('success');
      expect(response.data.merchant_name).toBe('Alfamart');
    });
  });
});
