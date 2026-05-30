"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { transactionsApi, Transaction as ApiTransaction } from "@/lib/api";

export type TransactionType = "pemasukan" | "pengeluaran";

export interface Transaction {
  id: string;
  description: string;    // mapped from API
  desc?: string;          // alias for backward compat
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  created_at: string;
  tag?: "needs" | "wants" | "save";
}

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, "id" | "date" | "desc" | "created_at">) => Promise<void>;
  clearTransactions: () => void;
  refreshTransactions: () => Promise<void>;
  summary: {
    total_pemasukan: number;
    total_pengeluaran: number;
    sisa_saldo: number;
    savings_ratio: number;
    category_breakdown: Record<string, number>;
  };
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Convert API transaction → local format
const mapApiToLocal = (t: ApiTransaction): Transaction => ({
  id: t.id,
  description: t.description,
  desc: t.description,        // backward compat alias
  amount: t.amount,
  type: t.type,
  category: t.category,
  tag: t.tag,
  created_at: t.created_at,
  date: new Date(t.created_at).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  }),
});

export function TransactionProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState({
    total_pemasukan: 0,
    total_pengeluaran: 0,
    sisa_saldo: 0,
    savings_ratio: 0,
    category_breakdown: {} as Record<string, number>,
  });

  const getUserId = async (): Promise<string | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  };

  const refreshTransactions = useCallback(async () => {
    const userId = await getUserId();
    if (!userId) {
      // Fallback: load from localStorage for guest/unauthenticated
      const saved = localStorage.getItem("ceamis_transactions");
      if (saved) {
        try { setTransactions(JSON.parse(saved)); } catch { /* ignore */ }
      }
      return;
    }

    setIsLoading(true);
    try {
      const [listRes, summaryRes] = await Promise.all([
        transactionsApi.getAll(userId, 100),
        transactionsApi.getSummary(userId),
      ]);

      setTransactions(listRes.data.map(mapApiToLocal));
      setSummary({
        total_pemasukan: summaryRes.total_pemasukan,
        total_pengeluaran: summaryRes.total_pengeluaran,
        sisa_saldo: summaryRes.sisa_saldo,
        savings_ratio: summaryRes.savings_ratio,
        category_breakdown: summaryRes.category_breakdown,
      });
    } catch (err) {
      console.error("Failed to fetch transactions from API, falling back to localStorage:", err);
      const saved = localStorage.getItem("ceamis_transactions");
      if (saved) {
        try { setTransactions(JSON.parse(saved)); } catch { /* ignore */ }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const addTransaction = async (
    transaction: Omit<Transaction, "id" | "date" | "desc" | "created_at">
  ) => {
    // Build a local transaction object immediately for optimistic UI update
    const localTx: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      desc: transaction.description,
    };

    const userId = await getUserId();

    if (!userId) {
      // Guest mode: update state + localStorage immediately
      const updated = [localTx, ...transactions];
      setTransactions(updated);
      localStorage.setItem("ceamis_transactions", JSON.stringify(updated));
      return;
    }

    // Authenticated: optimistically update the UI right away
    setTransactions(prev => [localTx, ...prev]);

    try {
      const created = await transactionsApi.create({
        user_id: userId,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        tag: transaction.tag,
      });
      // Replace the optimistic entry with the real one from the API
      setTransactions(prev => [
        mapApiToLocal(created),
        ...prev.filter(t => t.id !== localTx.id),
      ]);
      // Refresh summary
      const summaryRes = await transactionsApi.getSummary(userId);
      setSummary({
        total_pemasukan: summaryRes.total_pemasukan,
        total_pengeluaran: summaryRes.total_pengeluaran,
        sisa_saldo: summaryRes.sisa_saldo,
        savings_ratio: summaryRes.savings_ratio,
        category_breakdown: summaryRes.category_breakdown,
      });
    } catch (err) {
      console.error("Failed to save transaction to API, keeping optimistic entry:", err);
      // Persist the optimistic tx to localStorage as fallback backup
      const saved = localStorage.getItem("ceamis_transactions");
      const existing: Transaction[] = saved ? JSON.parse(saved) : [];
      localStorage.setItem("ceamis_transactions", JSON.stringify([localTx, ...existing]));
    }
  };

  const clearTransactions = () => {
    setTransactions([]);
    localStorage.removeItem("ceamis_transactions");
  };

  return (
    <TransactionContext.Provider
      value={{ transactions, isLoading, addTransaction, clearTransactions, refreshTransactions, summary }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider");
  }
  return context;
}
