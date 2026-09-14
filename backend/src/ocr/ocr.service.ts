import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ParseReceiptDto } from './dto/parse-receipt.dto';

export interface ParsedReceiptItem {
  name: string;
  qty: number;
  price: number;
  total: number;
}

export interface ParsedReceiptResult {
  merchant_name: string;
  transaction_date: string;
  category: string;
  total_amount: number;
  payment_method: string;
  items: ParsedReceiptItem[];
  auto_tag: 'needs' | 'wants';
  confidence_score: number;
  is_mock?: boolean;
}

@Injectable()
export class OcrService {
  private readonly logger = new Logger(OcrService.name);
  private readonly geminiApiKey: string | undefined;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.geminiApiKey =
      this.configService.get<string>('GEMINI_API_KEY') ||
      process.env.GEMINI_API_KEY;
  }

  /**
   * Parse raw OCR text from receipt into structured JSON.
   */
  async parseReceipt(dto: ParseReceiptDto): Promise<ParsedReceiptResult> {
    const rawText = dto.raw_text?.trim() || '';

    if (!rawText) {
      return this.getFallbackResult(rawText, 'Raw text is empty');
    }

    if (!this.geminiApiKey) {
      this.logger.warn('GEMINI_API_KEY not configured. Utilizing regex heuristic parser fallback.');
      return this.getFallbackResult(rawText, 'GEMINI_API_KEY missing');
    }

    try {
      const parsedFromGemini = await this.callGeminiApi(rawText);
      return parsedFromGemini;
    } catch (err) {
      this.logger.error(`Error calling Gemini API for OCR parsing: ${err?.message}`, err?.stack);
      return this.getFallbackResult(rawText, `Gemini API error: ${err?.message}`);
    }
  }

  /**
   * Call Gemini 2.0 Flash API to extract structured JSON from raw OCR receipt text
   */
  private async callGeminiApi(rawText: string): Promise<ParsedReceiptResult> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.geminiApiKey}`;

    const prompt = `
Kamu adalah mesin pengekstrak data dari teks mentah hasil OCR struk belanjaan Indonesia (Indomaret, Alfamart, restoran, SPBU, supermarket, dll).
Kembalikan HANYA JSON valid tanpa format markdown \`\`\`json atau karakter lain di luar JSON.

Ketentuan Ekstraksi:
1. merchant_name: Nama toko/merchant (string).
2. transaction_date: Format YYYY-MM-DD. Jika tanggal/tahun tidak ditemukan, gunakan tanggal hari ini: ${new Date().toISOString().split('T')[0]}.
3. category: Pilih salah satu dari ["Groceries", "Food & Beverage", "Utilities", "Health", "Transportation", "Shopping", "Entertainment", "Other"].
4. total_amount: Angka bersih total belanja akhir (integer tanpa simbol Rp, koma, atau titik).
5. payment_method: Pilihan dari ["Cash", "QRIS", "Debit", "Credit", "E-Wallet"] jika ada di struk, default "Cash".
6. items: Array [{ name: string, qty: number, price: number, total: number }].
7. auto_tag: "needs" (kebutuhan pokok/nutrisi/utilitas) atau "wants" (hiburan/snack/keinginan).
8. confidence_score: Angka desimal 0.0 s.d 1.0 yang menunjukkan tingkat keyakinan ekstraksi.

Teks Mentah Struk:
"""
${rawText}
"""
`;

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    };

    const { data } = await firstValueFrom(
      this.httpService.post(endpoint, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      }),
    );

    const candidateText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    if (!candidateText) {
      throw new Error('Gemini API returned an empty response');
    }

    // Clean JSON markdown wrappers if present
    const cleanedText = candidateText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/, '')
      .replace(/```$/, '')
      .trim();

    const parsedJson = JSON.parse(cleanedText);

    return {
      merchant_name: String(parsedJson.merchant_name || 'Toko/Merchant Tidak Terdeteksi'),
      transaction_date: String(parsedJson.transaction_date || new Date().toISOString().split('T')[0]),
      category: String(parsedJson.category || 'Other'),
      total_amount: Number(parsedJson.total_amount) || 0,
      payment_method: String(parsedJson.payment_method || 'Cash'),
      items: Array.isArray(parsedJson.items)
        ? parsedJson.items.map((item: any) => ({
            name: String(item.name || 'Item'),
            qty: Number(item.qty) || 1,
            price: Number(item.price) || 0,
            total: Number(item.total) || Number(item.price) || 0,
          }))
        : [],
      auto_tag: parsedJson.auto_tag === 'wants' ? 'wants' : 'needs',
      confidence_score: Number(parsedJson.confidence_score) || 0.9,
      is_mock: false,
    };
  }

  /**
   * Fallback heuristic parser using Regular Expressions when API key or Gemini service is unavailable
   */
  private getFallbackResult(rawText: string, reason: string): ParsedReceiptResult {
    this.logger.debug(`Executing heuristic fallback OCR parser. Reason: ${reason}`);

    const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
    const merchantName = lines.length > 0 ? lines[0] : 'Merchant Tidak Terdeteksi';

    // Heuristic date matching (DD/MM/YYYY or YYYY-MM-DD)
    const dateMatch = rawText.match(/\b(\d{2}[/-]\d{2}[/-]\d{4}|\d{4}[/-]\d{2}[/-]\d{2})\b/);
    let transactionDate = new Date().toISOString().split('T')[0];
    if (dateMatch) {
      const parts = dateMatch[1].split(/[/-]/);
      if (parts[0].length === 4) {
        transactionDate = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
      } else {
        transactionDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    // Heuristic Total extraction (look for "TOTAL", "RP", or largest trailing number)
    let totalAmount = 0;
    const totalMatch = rawText.match(/(?:TOTAL|TOTAL BELANJA|BAYAR|GRAND TOTAL)\s*[:=]?\s*(?:RP\.?)?\s*([\d.,]+)/i);
    if (totalMatch) {
      const cleanNum = totalMatch[1].replace(/[.,]/g, '');
      totalAmount = parseInt(cleanNum, 10) || 0;
    }

    // Payment method heuristic
    let paymentMethod = 'Cash';
    if (/qris/i.test(rawText)) paymentMethod = 'QRIS';
    else if (/debit/i.test(rawText)) paymentMethod = 'Debit';
    else if (/credit|kartu kredit/i.test(rawText)) paymentMethod = 'Credit';
    else if (/gopay|ovo|dana|shopeepay/i.test(rawText)) paymentMethod = 'E-Wallet';

    // Category heuristic
    let category = 'Groceries';
    let autoTag: 'needs' | 'wants' = 'needs';

    if (/cafe|coffe|kopi|boba|resto|makanan|starbucks/i.test(rawText)) {
      category = 'Food & Beverage';
      autoTag = 'wants';
    } else if (/pln|listrik|pdam|indihome|pulsa/i.test(rawText)) {
      category = 'Utilities';
      autoTag = 'needs';
    } else if (/spbu|pertamina|shell|bensin|gojek|grab/i.test(rawText)) {
      category = 'Transportation';
      autoTag = 'needs';
    } else if (/apotek|kimia farma|k24|rumah sakit/i.test(rawText)) {
      category = 'Health';
      autoTag = 'needs';
    }

    return {
      merchant_name: merchantName,
      transaction_date: transactionDate,
      category,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      items: [
        {
          name: 'Ringkasan Belanja',
          qty: 1,
          price: totalAmount,
          total: totalAmount,
        },
      ],
      auto_tag: autoTag,
      confidence_score: 0.65,
      is_mock: true,
    };
  }
}
