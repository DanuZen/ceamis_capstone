"use client";

import { useState, useEffect } from "react";
import { Brain, ArrowUpDown, CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";

// ── Types ─────────────────────────────────────────────

interface ModelVersion {
  id: string;
  version_tag: string;
  algorithm: string;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc?: number;
  is_active: boolean;
  deployed_at: string;
}

// ── API Config ────────────────────────────────────────

const AI_BASE_URL = process.env.NEXT_PUBLIC_AI_URL || "http://localhost:8000/api/v1";

// ── Component ─────────────────────────────────────────

export default function ModelGovernancePage() {
  const [models, setModels] = useState<ModelVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolling, setRolling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rollbackReason, setRollbackReason] = useState("");
  const [showRollbackModal, setShowRollbackModal] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  async function fetchModels() {
    try {
      setLoading(true);
      const res = await fetch(`${AI_BASE_URL}/admin/models`);
      const data = await res.json();
      if (data.success) {
        setModels(data.data);
      }
    } catch (err) {
      setError("Gagal memuat data model. Pastikan backend aktif.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRollback() {
    if (!selectedModelId || !rollbackReason.trim()) return;

    try {
      setRolling(selectedModelId);
      const res = await fetch(`${AI_BASE_URL}/admin/models/rollback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_model_version_id: selectedModelId,
          reason: rollbackReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchModels();
        setShowRollbackModal(false);
        setRollbackReason("");
        setSelectedModelId(null);
      }
    } catch (err) {
      setError("Rollback gagal.");
    } finally {
      setRolling(null);
    }
  }

  const activeModel = models.find((m) => m.is_active);

  return (
    <div className="admin-governance-page">
      <style jsx>{`
        .admin-governance-page {
          padding: 28px;
          max-width: 1100px;
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
          background: var(--color-purple, #5833EE);
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

        /* Active Model Hero */
        .active-model-hero {
          border: 2.5px solid var(--color-navy, #0A192F);
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(88,51,238,0.06), rgba(0,229,255,0.06));
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 4px 4px 0 var(--color-navy, #0A192F);
        }
        .hero-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--color-purple, #5833EE);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 14px;
        }
        .hero-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 14px;
          margin-top: 14px;
        }
        .metric-card {
          border: 2px solid var(--color-navy, #0A192F);
          border-radius: 10px;
          padding: 14px;
          background: white;
          box-shadow: 2px 2px 0 var(--color-navy, #0A192F);
          text-align: center;
        }
        .metric-value {
          font-size: 28px;
          font-weight: 900;
          font-family: var(--font-heading, 'Quicksand', sans-serif);
          color: var(--color-purple, #5833EE);
        }
        .metric-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-muted, #526082);
          margin-top: 4px;
        }

        /* Model Table */
        .models-table-wrapper {
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
          padding: 12px 16px;
          text-align: left;
          font-size: 12px;
          font-weight: 700;
          color: var(--color-text-muted, #526082);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1.5px solid #E2E8F0;
        }
        td {
          padding: 14px 16px;
          font-size: 14px;
          font-weight: 500;
          color: var(--color-navy, #0A192F);
          border-bottom: 1px solid #F1F5F9;
        }
        tr:hover td {
          background: rgba(88,51,238,0.03);
        }
        .badge-active {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          background: rgba(184,255,0,0.15);
          color: #2D6A0F;
          border: 1.5px solid #2D6A0F;
        }
        .badge-inactive {
          display: inline-flex;
          padding: 3px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          background: #F1F5F9;
          color: var(--color-text-muted, #526082);
          border: 1.5px solid #E2E8F0;
        }
        .btn-rollback {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 8px;
          border: 2px solid var(--color-navy, #0A192F);
          background: var(--color-orange, #FF5233);
          color: white;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 2px 2px 0 var(--color-navy, #0A192F);
          transition: all 0.15s;
        }
        .btn-rollback:hover {
          transform: translate(1px, 1px);
          box-shadow: 1px 1px 0 var(--color-navy, #0A192F);
        }
        .btn-rollback:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(10,25,47,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border: 2.5px solid var(--color-navy, #0A192F);
          border-radius: 14px;
          padding: 28px;
          width: 420px;
          box-shadow: 6px 6px 0 var(--color-navy, #0A192F);
        }
        .modal-content h3 {
          font-size: 18px;
          font-weight: 800;
          color: var(--color-navy, #0A192F);
          margin: 0 0 16px;
        }
        .modal-content textarea {
          width: 100%;
          border: 2px solid var(--color-navy, #0A192F);
          border-radius: 8px;
          padding: 12px;
          font-size: 14px;
          resize: vertical;
          min-height: 80px;
          font-family: inherit;
        }
        .modal-actions {
          display: flex;
          gap: 10px;
          margin-top: 16px;
          justify-content: flex-end;
        }
        .btn-cancel {
          padding: 8px 18px;
          border-radius: 8px;
          border: 2px solid #E2E8F0;
          background: white;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-confirm {
          padding: 8px 18px;
          border-radius: 8px;
          border: 2px solid var(--color-navy, #0A192F);
          background: var(--color-orange, #FF5233);
          color: white;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 2px 2px 0 var(--color-navy, #0A192F);
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
          <Brain size={24} color="white" />
        </div>
        <div>
          <h1>Model Governance</h1>
          <p className="subtitle">Kelola versi model ML prediksi risiko pra-pembelian</p>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {loading ? (
        <div className="loading-state">Memuat data model...</div>
      ) : (
        <>
          {/* Active Model Hero */}
          {activeModel && (
            <div className="active-model-hero">
              <span className="hero-label">
                <CheckCircle2 size={14} /> Model Aktif
              </span>
              <h2 style={{ margin: "0 0 4px", fontWeight: 900, fontSize: 20, color: "#0A192F" }}>
                {activeModel.version_tag}
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: "#526082", fontWeight: 500 }}>
                {activeModel.algorithm} — Deployed {new Date(activeModel.deployed_at).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
              </p>
              <div className="hero-metrics">
                <div className="metric-card">
                  <div className="metric-value">{(activeModel.precision * 100).toFixed(1)}%</div>
                  <div className="metric-label">Precision</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">{(activeModel.recall * 100).toFixed(1)}%</div>
                  <div className="metric-label">Recall</div>
                </div>
                <div className="metric-card">
                  <div className="metric-value">{(activeModel.f1_score * 100).toFixed(1)}%</div>
                  <div className="metric-label">F1-Score</div>
                </div>
                {activeModel.roc_auc && (
                  <div className="metric-card">
                    <div className="metric-value">{(activeModel.roc_auc * 100).toFixed(1)}%</div>
                    <div className="metric-label">ROC-AUC</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Models Table */}
          <div className="models-table-wrapper">
            <div className="table-header">
              <h2><ArrowUpDown size={18} /> Riwayat Versi Model</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Version</th>
                  <th>Algorithm</th>
                  <th>Precision</th>
                  <th>Recall</th>
                  <th>F1</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model) => (
                  <tr key={model.id}>
                    <td style={{ fontWeight: 700 }}>{model.version_tag}</td>
                    <td>{model.algorithm}</td>
                    <td>{(model.precision * 100).toFixed(1)}%</td>
                    <td>{(model.recall * 100).toFixed(1)}%</td>
                    <td style={{ fontWeight: 700 }}>{(model.f1_score * 100).toFixed(1)}%</td>
                    <td>
                      {model.is_active ? (
                        <span className="badge-active">
                          <CheckCircle2 size={12} /> Active
                        </span>
                      ) : (
                        <span className="badge-inactive">Inactive</span>
                      )}
                    </td>
                    <td>
                      {!model.is_active && (
                        <button
                          className="btn-rollback"
                          disabled={rolling !== null}
                          onClick={() => {
                            setSelectedModelId(model.id);
                            setShowRollbackModal(true);
                          }}
                        >
                          <RotateCcw size={14} /> Rollback
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Rollback Modal */}
      {showRollbackModal && (
        <div className="modal-overlay" onClick={() => setShowRollbackModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>⚠️ Konfirmasi Rollback Model</h3>
            <p style={{ fontSize: 14, color: "#526082", marginBottom: 14 }}>
              Rollback akan mengubah model aktif. Berikan alasan:
            </p>
            <textarea
              value={rollbackReason}
              onChange={(e) => setRollbackReason(e.target.value)}
              placeholder="Contoh: False positive rate meningkat tajam..."
            />
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowRollbackModal(false)}>
                Batal
              </button>
              <button
                className="btn-confirm"
                onClick={handleRollback}
                disabled={!rollbackReason.trim() || rolling !== null}
              >
                {rolling ? "Memproses..." : "Konfirmasi Rollback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
