/**
 * CEAMIS API Client
 * Terpusat untuk semua request ke CEAMIS 2.0 FastAPI Backend
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api/v1';

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
  } catch (err: any) {
    console.warn(`[API] Failed to fetch ${BASE_URL}${path}:`, err?.message || err);
    throw new Error(err?.message || 'Failed to fetch');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `API Error: ${res.status}`);
  }

  // Handle 204 No Content atau body kosong
  if (res.status === 204) return {} as T;
  
  const text = await res.text();
  if (!text) return null as unknown as T;
  
  try {
    return JSON.parse(text);
  } catch (e) {
    return text as unknown as T;
  }
}

// ── Users ─────────────────────────────────────────────────────
export const usersApi = {
  getProfile: (userId: string) =>
    request<UserProfile>(`/users/${userId}`),

  updateProfile: (userId: string, data: Partial<UserProfile>) =>
    request<UserProfile>(`/users/${userId}/profile`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  addXp: (userId: string, amount: number) =>
    request<UserProfile & { leveled_up: boolean }>(`/users/${userId}/xp`, {
      method: 'PATCH',
      body: JSON.stringify({ amount }),
    }),

  updateStreak: (userId: string) =>
    request<UserProfile>(`/users/${userId}/streak`, { method: 'PATCH' }),
};

// ── Transactions ──────────────────────────────────────────────
export const transactionsApi = {
  getAll: (userId: string, limit = 50, offset = 0) =>
    request<TransactionListResponse>(
      `/transactions?user_id=${userId}&limit=${limit}&offset=${offset}`,
    ),

  getSummary: (userId: string) =>
    request<TransactionSummary>(`/transactions/summary?user_id=${userId}`),

  create: (data: CreateTransactionPayload) =>
    request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  remove: (userId: string, id: string) =>
    request<{ message: string; id: string }>(
      `/transactions/${id}?user_id=${userId}`,
      { method: 'DELETE' },
    ),
};

// ── Onboarding ────────────────────────────────────────────────
export const onboardingApi = {
  save: (data: OnboardingPayload) =>
    request<{ message: string; data: unknown; savings_ratio: number }>(
      '/onboarding',
      { method: 'POST', body: JSON.stringify(data) },
    ),

  get: (userId: string) =>
    request<OnboardingData | null>(`/onboarding?user_id=${userId}`),

  getStatus: (userId: string) =>
    request<{ user_id: string; onboarding_completed: boolean }>(
      `/onboarding/status?user_id=${userId}`,
    ),
};

// ── AI ────────────────────────────────────────────────────────
export const aiApi = {
  getHealthScore: (payload: HealthScorePayload) =>
    request<HealthScoreResult>('/ai/health-score', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getSpendingCluster: (payload: SpendingClusterPayload) =>
    request<SpendingClusterResult>('/ai/spending-cluster', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  chat: (payload: ChatPayload) =>
    request<ChatResult>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// ── OCR Receipt Gateway ───────────────────────────────────────
export const ocrApi = {
  parseReceipt: async (payload: OcrParsePayload): Promise<OcrParseApiResponse> => {
    try {
      const res = await request<any>('/ocr/parse-receipt', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      // Normalize response shape from FastAPI/NestJS
      if (res && res.data) {
        return res as OcrParseApiResponse;
      }
      return {
        status: 'success',
        message: 'Struk berhasil diekstrak',
        data: res,
      };
    } catch (err: any) {
      console.warn('[OCR] Remote backend unavailable, using heuristic fallback parser:', err?.message);
      return fallbackParseReceipt(payload.raw_text);
    }
  },
};

function fallbackParseReceipt(rawText: string): OcrParseApiResponse {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  let merchantName = 'Merchant Terdeteksi';
  if (lines.length > 0) {
    if (/^(STK|INV|TRX|NO|KODE|RECEIPT|STRUK|ID)[-:\s#]/i.test(lines[0]) && lines.length > 1) {
      merchantName = lines[1];
    } else {
      merchantName = lines[0];
    }
  }

  const dateMatch = rawText.match(/\b(\d{2}[/-]\d{2}[/-]\d{4}|\d{4}[/-]\d{2}[/-]\d{2})\b/);
  let transactionDate = new Date().toISOString().split('T')[0];
  if (dateMatch) {
    const parts = dateMatch[1].split(/[/-]/);
    if (parts[0].length === 4) {
      transactionDate = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    } else if (parts[2].length === 4) {
      transactionDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }

  let paymentMethod = 'Cash';
  if (/qris/i.test(rawText)) paymentMethod = 'QRIS';
  else if (/debit/i.test(rawText)) paymentMethod = 'Debit';
  else if (/kredit|credit/i.test(rawText)) paymentMethod = 'Credit';
  else if (/gopay|ovo|shopee|dana/i.test(rawText)) paymentMethod = 'E-Wallet';

  let category = 'Groceries';
  let autoTag: 'needs' | 'wants' = 'needs';
  const lower = rawText.toLowerCase();
  if (lower.includes('kopi') || lower.includes('coffee') || lower.includes('cafe') || lower.includes('resto') || lower.includes('burger') || lower.includes('makan') || lower.includes('bakso')) {
    category = 'Food & Beverage';
    autoTag = 'wants';
  } else if (lower.includes('bioskop') || lower.includes('cinema') || lower.includes('game') || lower.includes('tiket')) {
    category = 'Entertainment';
    autoTag = 'wants';
  } else if (lower.includes('bensin') || lower.includes('spbu') || lower.includes('pertamina') || lower.includes('ojol') || lower.includes('grab') || lower.includes('gojek')) {
    category = 'Transportation';
    autoTag = 'needs';
  } else if (lower.includes('pln') || lower.includes('listrik') || lower.includes('pdam') || lower.includes('wifi') || lower.includes('indihome')) {
    category = 'Utilities';
    autoTag = 'needs';
  } else if (lower.includes('apotek') || lower.includes('obat') || lower.includes('klinik') || lower.includes('rs')) {
    category = 'Health';
    autoTag = 'needs';
  } else if (lower.includes('baju') || lower.includes('fashion') || lower.includes('sepatu') || lower.includes('mall') || lower.includes('clothing')) {
    category = 'Shopping';
    autoTag = 'wants';
  }

  let totalAmount = 0;
  const totalMatches = [...rawText.matchAll(/(?:total|grand\s*total|bayar|rp\.?)\s*:?\s*([\d.,]+)/gi)];
  if (totalMatches.length > 0) {
    const lastMatch = totalMatches[totalMatches.length - 1][1];
    const cleaned = lastMatch.replace(/[.,](\d{2})$/, '').replace(/[^\d]/g, '');
    totalAmount = parseInt(cleaned, 10) || 0;
  } else {
    const numberMatches = rawText.match(/\b\d{4,9}\b/g);
    if (numberMatches) {
      totalAmount = Math.max(...numberMatches.map((n) => parseInt(n, 10)));
    }
  }

  const items: OcrItem[] = [];
  for (const line of lines) {
    const itemMatch = line.match(/^([A-Za-z0-9\s]+?)\s+(?:(\d+)\s*[xX]\s*)?(\d[\d.,]*)$/);
    if (itemMatch && !/total|subtotal|tunai|kembali|cash|qris/i.test(itemMatch[1])) {
      const name = itemMatch[1].trim();
      const qty = itemMatch[2] ? parseInt(itemMatch[2], 10) : 1;
      const price = parseInt(itemMatch[3].replace(/[^\d]/g, ''), 10) || 0;
      if (price > 0) {
        items.push({ name, qty, price, total: price * qty });
      }
    }
  }

  return {
    status: 'success',
    message: 'Struk berhasil diekstrak',
    data: {
      merchant_name: merchantName,
      transaction_date: transactionDate,
      category,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      items,
      auto_tag: autoTag,
      confidence_score: 0.85,
      is_mock: true,
    },
  };
}

// ── Warnings ──────────────────────────────────────────────────
export const warningsApi = {
  getAll: (userId: string) =>
    request<Warning[]>(`/warnings?user_id=${userId}`),

  resolve: (userId: string, warningId: string) =>
    request<Warning>(`/warnings/${warningId}/resolve?user_id=${userId}`, {
      method: 'PATCH',
    }),
};

// ─────────────────────────────────────────────────────────────
// Type Definitions
// ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  level: number;
  xp: number;
  streak: number;
  label: string;
  unlocked_badges: string[];
  health_score: number;
  warning_triggered: boolean;
  risk_profile?: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  type: 'pemasukan' | 'pengeluaran';
  category: string;
  tag?: 'needs' | 'wants' | 'save';
  created_at: string;
}

export interface TransactionListResponse {
  data: Transaction[];
  total: number;
  limit: number;
  offset: number;
}

export interface TransactionSummary {
  total_pemasukan: number;
  total_pengeluaran: number;
  sisa_saldo: number;
  savings_ratio: number;
  category_breakdown: Record<string, number>;
  total_transactions: number;
}

export interface CreateTransactionPayload {
  user_id: string;
  description: string;
  amount: number;
  type: 'pemasukan' | 'pengeluaran';
  category: string;
  tag?: 'needs' | 'wants' | 'save';
}

export interface OnboardingPayload {
  user_id: string;
  name: string;
  age: number;
  income: number;
  income_source: string;
  top_expenses: string[];
  monthly_expense: number;
  goals: string[];
  risk_profile?: string;
  
  // Model 3 Features
  tanggungan_keluarga?: number;
  city_tier_enc?: number;
  toleransi_rugi_enc?: number;
  save_habit?: number;
  punya_tabungan?: boolean;
  jumlah_tabungan_bulan?: number;
}

export interface OnboardingData extends OnboardingPayload {
  id: string;
  savings_ratio: number;
  completed_at: string;
}

export interface HealthScorePayload {
  user_id: string;
  monthly_income: number;
  monthly_expense: number;
  savings_ratio: number;
  risk_profile?: string;
}

export interface HealthScoreResult {
  health_score: number;
  risk_level: string;
  triggered: boolean;
  is_mock: boolean;
}

export interface SpendingClusterPayload {
  user_id: string;
}

export interface SpendingClusterResult {
  cluster_label: string;
  dominant_category: string;
  insight: string;
  needs_ratio: number;
  wants_ratio: number;
  savings_ratio: number;
  trend: 'improving' | 'stable' | 'declining';
  is_mock: boolean;
}

export interface ChatPayload {
  user_id: string;
  message: string;
  context?: object;
}

export interface ChatResult {
  reply: string;
  suggestions: string[];
  is_mock?: boolean;
}

export interface Warning {
  id: string;
  user_id: string;
  type: string;
  message: string;
  tip: string;
  severity: 'high' | 'medium' | 'low';
  is_resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

export interface OcrParsePayload {
  raw_text: string;
  image_url?: string;
  user_id?: string;
}

export interface OcrItem {
  name: string;
  qty: number;
  price: number;
  total: number;
}

export interface ParsedReceiptData {
  merchant_name: string;
  transaction_date: string;
  category: string;
  total_amount: number;
  payment_method: string;
  items: OcrItem[];
  auto_tag: 'needs' | 'wants';
  confidence_score: number;
  is_mock?: boolean;
}

export interface OcrParseApiResponse {
  status: string;
  message: string;
  data: ParsedReceiptData;
}
