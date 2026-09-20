"use client";

import { useState, useEffect } from "react";
import { Shield, FileSearch, TrendingDown, AlertCircle, CheckCircle2, Clock, ChevronLeft, ChevronRight } from "lucide-react";

// ── Types ─────────────────────────────────────────────

interface AuditLog {
  id: string;
  user_id: string;
  user_name: string;
  category_name: string;
  planned_amount: number;
  risk_level: string;
  risk_score: number;
  decision: string | null;
  was_impulsive: boolean | null;
  created_at: string;
}

interface AuditSummary {
  total_checks: number;
  total_prevented: number;
  prevention_rate: number;
  total_amount_prevented: number;
}

// ── API Config ────────────────────────────────────────

const AI_BASE_URL = process.env.NEXT_PUBLIC_AI_URL || "http://localhost:8000/api/v1";

// ── Component ─────────────────────────────────────────

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [summary, setSummary] = useState<AuditSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  async function fetchLogs(p: number) {
    try {
      setLoading(true);
      const res = await fetch(`${AI_BASE_URL}/admin/audit-logs?page=${p}&per_page=10`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.data.logs);
        setSummary(data.data.summary);
        setTotalPages(data.data.pagination.total_pages);
      }
    } catch (err) {
      setError("Gagal memuat data audit log. Pastikan backend aktif.");
    } finally {
      setLoading(false);
    }
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  }

  function getRiskBadge(level: string) {
    const styles: Record<string, { bg: string; color: string; border: string }> = {
      HIGH: { bg: "rgba(255,82,51,0.12)", color: "#FF5233", border: "#FF5233" },
      MEDIUM: { bg: "rgba(245,158,11,0.12)", color: "#B45309", border: "#F59E0B" },
      LOW: { bg: "rgba(184,255,0,0.12)", color: "#2D6A0F", border: "#2D6A0F" },
    };
    const s = styles[level] || styles.LOW;
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700,
        background: s.bg, color: s.color, border: `1.5px solid ${s.border}`,
      }}>
        {level === "HIGH" ? "🔴" : level === "MEDIUM" ? "🟡" : "🟢"} {level}
      </span>
    );
  }

  function getDecisionBadge(decision: string | null) {
    if (!decision) return <span style={{ color: "#94A3B8", fontSize: 12, fontWeight: 600 }}>—</span>;
    const map: Record<string, { icon: string; color: string }> = {
      PROCEED: { icon: "🛒", color: "#526082" },
      ADJUST: { icon: "✏️", color: "#F59E0B" },
      POSTPONE: { icon: "⏸️", color: "#2D6A0F" },
    };
    const d = map[decision] || map.PROCEED;
    return (
      <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>
        {d.icon} {decision}
      </span>
    );
  }

  return (
    <div className="audit-logs-page">
      <style jsx>{`
        .audit-logs-page {
          padding: 28px;
          max-width: 1200px;
        }
        .page-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
        }
        .page-header .icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 2.5px solid var(--color-navy, #0A192F);
          background: var(--color-lime, #B8FF00);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 3px 3px 0 var(--color-navy, #0A192F);
        }
        h1 {
          font-family: var(--font-heading, 'Quicksand', sans-serif);
          font-weight: 800;
          font-size: 24px;
          color: var(--color-navy, #0A192F);
          margin: 0;
        }
        .subtitle {
          font-size: 14px;
          color: var(--color-text-muted, #526082);
          font-weight: 500;
          margin: 0;
        }

        /* Summary Cards */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        .summary-card {
          border: 2.5px solid var(--color-navy, #0A192F);
          border-radius: 12px;
          padding: 20px;
          background: white;
          box-shadow: 3px 3px 0 var(--color-navy, #0A192F);
        }
        .summary-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
        }
        .summary-card-header span {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-text-muted, #526082);
        }
        .summary-value {
          font-size: 32px;
          font-weight: 900;
          font-family: var(--font-heading, 'Quicksand', sans-serif);
          color: var(--color-navy, #0A192F);
        }
        .summary-value.purple { color: var(--color-purple, #5833EE); }
        .summary-value.lime { color: #2D6A0F; }
        .summary-value.orange { color: var(--color-orange, #FF5233); }

        /* Table */
        .logs-table-wrapper {
          border: 2.5px solid var(--color-navy, #0A192F);
          border-radius: 14px;
          overflow: hidden;
          background: white;
          box-shadow: 4px 4px 0 var(--color-navy, #0A192F);
        }
        .table-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          border-bottom: 2.5px solid var(--color-navy, #0A192F);
          background: var(--color-bg, #F1F5F9);
        }
        .table-header h2 {
          font-size: 16px;
          font-weight: 800;
          color: var(--color-navy, #0A192F);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          padding: 12px 14px;
          text-align: left;
          font-size: 11px;
          font-weight: 700;
          color: var(--color-text-muted, #526082);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1.5px solid #E2E8F0;
        }
        td {
          padding: 12px 14px;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-navy, #0A192F);
          border-bottom: 1px solid #F1F5F9;
        }
        tr:hover td {
          background: rgba(184,255,0,0.04);
        }

        /* Pagination */
        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px;
          border-top: 1.5px solid #E2E8F0;
        }
        .page-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: 2px solid var(--color-navy, #0A192F);
          background: white;
          cursor: pointer;
          box-shadow: 2px 2px 0 var(--color-navy, #0A192F);
          transition: all 0.15s;
        }
        .page-btn:hover:not(:disabled) {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0 var(--color-navy, #0A192F);
        }
        .page-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .page-info {
          font-size: 14px;
          font-weight: 700;
          color: var(--color-navy, #0A192F);
        }

        .error-banner {
          background: rgba(255,82,51,0.1);
          border: 2px solid var(--color-orange, #FF5233);
          border-radius: 10px;
          padding: 12px 16px;
          margin-bottom: 20px;
          color: var(--color-orange, #FF5233);
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .loading-state {
          text-align: center;
          padding: 60px;
          color: var(--color-text-muted, #526082);
          font-weight: 600;
        }
      `}</style>

      {/* Header */}
      <div className="page-header">
        <div className="icon-box">
          <FileSearch size={24} color="#0A192F" />
        </div>
        <div>
          <h1>Audit Log Intervensi</h1>
          <p className="subtitle">Riwayat keputusan pra-pembelian & efektivitas pencegahan</p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {loading ? (
        <div className="loading-state">Memuat data audit log...</div>
      ) : (
        <>
          {/* Summary Cards */}
          {summary && (
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-card-header">
                  <Shield size={18} color="#5833EE" />
                  <span>Total Cek Risiko</span>
                </div>
                <div className="summary-value purple">{summary.total_checks}</div>
              </div>
              <div className="summary-card">
                <div className="summary-card-header">
                  <TrendingDown size={18} color="#2D6A0F" />
                  <span>Berhasil Dicegah</span>
                </div>
                <div className="summary-value lime">{summary.total_prevented}</div>
              </div>
              <div className="summary-card">
                <div className="summary-card-header">
                  <CheckCircle2 size={18} color="#2D6A0F" />
                  <span>Tingkat Pencegahan</span>
                </div>
                <div className="summary-value lime">{summary.prevention_rate}%</div>
              </div>
              <div className="summary-card">
                <div className="summary-card-header">
                  <AlertCircle size={18} color="#FF5233" />
                  <span>Total Dicegah</span>
                </div>
                <div className="summary-value orange">{formatCurrency(summary.total_amount_prevented)}</div>
              </div>
            </div>
          )}

          {/* Logs Table */}
          <div className="logs-table-wrapper">
            <div className="table-header">
              <h2><FileSearch size={18} /> Log Intervensi Pra-Pembelian</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>User</th>
                  <th>Kategori</th>
                  <th>Nominal</th>
                  <th>Risk Level</th>
                  <th>Score</th>
                  <th>Keputusan</th>
                  <th>Impulsif?</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Clock size={14} color="#94A3B8" />
                        {new Date(log.created_at).toLocaleDateString("id-ID", { month: "short", day: "numeric" })}
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>{log.user_name}</td>
                    <td>{log.category_name}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(log.planned_amount)}</td>
                    <td>{getRiskBadge(log.risk_level)}</td>
                    <td style={{ fontWeight: 700 }}>{(log.risk_score * 100).toFixed(0)}%</td>
                    <td>{getDecisionBadge(log.decision)}</td>
                    <td>
                      {log.was_impulsive === null ? (
                        <span style={{ color: "#94A3B8", fontSize: 12 }}>—</span>
                      ) : log.was_impulsive ? (
                        <span style={{ color: "#FF5233", fontWeight: 700, fontSize: 13 }}>❌ Ya</span>
                      ) : (
                        <span style={{ color: "#2D6A0F", fontWeight: 700, fontSize: 13 }}>✅ Tidak</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button
                className="page-btn"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={18} />
              </button>
              <span className="page-info">Halaman {page} / {totalPages}</span>
              <button
                className="page-btn"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
