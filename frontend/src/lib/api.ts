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
// Parsing is handled entirely by the backend (Gemini AI → heuristic fallback).
// No client-side duplication — keeps logic in one place for easier maintenance.
export const ocrApi = {
  parseReceipt: async (payload: OcrParsePayload): Promise<OcrParseApiResponse> => {
    const res = await request<any>('/ocr/parse-receipt', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    // Normalize response shape from FastAPI
    if (res && res.data) {
      return res as OcrParseApiResponse;
    }
    return {
      status: 'success',
      message: 'Struk berhasil diekstrak',
      data: res,
    };
  },
};

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
