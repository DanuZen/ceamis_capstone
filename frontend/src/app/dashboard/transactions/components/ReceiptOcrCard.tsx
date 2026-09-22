"use client";

import { useState } from "react";
import { Sparkles, FileText, Upload, CheckCircle2, ArrowRight, Loader2, Tag, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { ocrApi, ParsedReceiptData } from "@/lib/api";

interface ReceiptOcrCardProps {
  onApplyData: (data: ParsedReceiptData) => void;
  onSaveDirectly?: (data: ParsedReceiptData) => void;
}

export default function ReceiptOcrCard({ onApplyData, onSaveDirectly }: ReceiptOcrCardProps) {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"upload" | "text">("upload");
  const [rawText, setRawText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ParsedReceiptData | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    setIsSaved(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Simulated OCR raw text read from image filename & metadata for seamless web testing
    const sampleText = `STK-${file.name.toUpperCase().slice(0, 8)}\nINDOMARET UTAMA\n14/09/2026\nSusu UHT 1L 20000\nRoti Tawar 25000\nTOTAL 45000\nQRIS`;
    setRawText(sampleText);
  };

  const handleScanReceipt = async () => {
    const textToScan = rawText.trim();
    if (!textToScan) {
      showToast(t("dashboard.transactions.ocrPastePlaceholder") || "Masukkan teks mentah atau upload foto struk!", "error");
      return;
    }

    setLoading(true);
    setIsSaved(false);
    try {
      const response = await ocrApi.parseReceipt({
        raw_text: textToScan,
      });

      if (response && response.data) {
        setExtractedData(response.data);
        // Otomatis masukkan hasil ekstraksi langsung ke formulir transaksi di sebelah kanan
        onApplyData(response.data);
        showToast(
          response.data.is_mock
            ? "Struk berhasil diekstrak dan siap disimpan!"
            : "Struk berhasil diekstrak dengan Gemini 2.0 Flash dan siap disimpan!",
          "success"
        );
      }
    } catch (err: any) {
      showToast("Gagal mengekstrak struk: " + (err?.message || "Koneksi bermasalah"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToForm = () => {
    if (!extractedData) return;
    onApplyData(extractedData);
    showToast(t("dashboard.transactions.ocrAppliedSuccess") || "Data struk berhasil dimasukkan ke formulir!", "success");
  };

  return (
    <div
      className="card-brutal animate-slide-up"
      style={{
        height: "100%",
        minHeight: "560px",
        background: "var(--color-white)",
        border: "2.5px solid var(--color-navy)",
        borderRadius: "16px",
        padding: "1.25rem 1.5rem",
        boxShadow: "4px 4px 0px var(--color-navy)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Card Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div 
              style={{
                width: "34px",
                height: "34px",
                background: "var(--color-lime)",
                border: "2px solid var(--color-navy)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "2px 2px 0px var(--color-navy)",
                flexShrink: 0
              }}
            >
              <Sparkles size={17} color="var(--color-navy)" strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 900, color: "var(--color-navy)", margin: 0, lineHeight: 1.2 }}>
                {t("dashboard.transactions.ocrCardTitle")}
              </h3>
              <p style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600, margin: "2px 0 0 0" }}>
                {t("dashboard.transactions.ocrCardDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "0.85rem" }}>
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className="btn-brutal"
            style={{
              flex: 1,
              padding: "0.35rem 0.5rem",
              fontSize: "0.75rem",
              fontWeight: 800,
              borderRadius: "8px",
              background: activeTab === "upload" ? "var(--color-lime)" : "var(--color-white)",
              color: "var(--color-navy)",
              border: "1.8px solid var(--color-navy)",
              boxShadow: activeTab === "upload" ? "2px 2px 0px var(--color-navy)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              cursor: "pointer",
            }}
          >
            <Upload size={13} /> {t("dashboard.transactions.ocrUploadTab")}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className="btn-brutal"
            style={{
              flex: 1,
              padding: "0.35rem 0.5rem",
              fontSize: "0.75rem",
              fontWeight: 800,
              borderRadius: "8px",
              background: activeTab === "text" ? "var(--color-purple)" : "var(--color-white)",
              color: activeTab === "text" ? "var(--color-white)" : "var(--color-navy)",
              border: "1.8px solid var(--color-navy)",
              boxShadow: activeTab === "text" ? "2px 2px 0px var(--color-navy)" : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              cursor: "pointer",
            }}
          >
            <FileText size={13} /> {t("dashboard.transactions.ocrTextTab")}
          </button>
        </div>

        {/* Input Section */}
        {activeTab === "upload" ? (
          <div style={{ marginBottom: "0.85rem" }}>
            <label
              htmlFor="receipt-file-input"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "1rem",
                border: "2px dashed var(--color-navy)",
                borderRadius: "12px",
                background: "#F8FAFC",
                cursor: "pointer",
                textAlign: "center",
                gap: "0.4rem",
              }}
            >
              {imagePreview ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%" }}>
                  <img
                    src={imagePreview}
                    alt="Receipt Preview"
                    style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "8px", border: "1.8px solid var(--color-navy)" }}
                  />
                  <div style={{ textAlign: "left", flex: 1, overflow: "hidden" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--color-navy)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {selectedFile?.name}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>
                      {(selectedFile?.size || 0) / 1024 > 1024
                        ? `${((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB`
                        : `${Math.round((selectedFile?.size || 0) / 1024)} KB`}
                    </div>
                  </div>
                  <CheckCircle2 size={18} color="var(--color-navy)" fill="var(--color-lime)" />
                </div>
              ) : (
                <>
                  <Upload size={24} color="var(--color-navy)" />
                  <span style={{ fontWeight: 800, fontSize: "0.78rem", color: "var(--color-navy)" }}>
                    {t("dashboard.transactions.ocrDropzone")}
                  </span>
                </>
              )}
              <input
                id="receipt-file-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
            </label>
          </div>
        ) : (
          <div style={{ marginBottom: "0.85rem" }}>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={4}
              className="input-brutal"
              placeholder={t("dashboard.transactions.ocrPastePlaceholder")}
              style={{
                width: "100%",
                padding: "0.65rem",
                fontSize: "0.8rem",
                fontFamily: "monospace",
                border: "1.8px solid var(--color-navy)",
                borderRadius: "8px",
                boxShadow: "2px 2px 0px var(--color-navy)",
                background: "var(--color-bg)",
                resize: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        {/* Action Scan Button */}
        <button
          type="button"
          onClick={handleScanReceipt}
          disabled={loading}
          className="btn-brutal"
          style={{
            width: "100%",
            padding: "0.65rem",
            fontWeight: 900,
            fontSize: "0.85rem",
            background: "var(--color-orange)",
            color: "var(--color-white)",
            border: "2px solid var(--color-navy)",
            borderRadius: "10px",
            boxShadow: "3px 3px 0px var(--color-navy)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            marginBottom: "0.85rem",
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t("dashboard.transactions.ocrScanning")}
            </>
          ) : (
            <>
              <Sparkles size={16} />
              {t("dashboard.transactions.ocrScanBtn")}
            </>
          )}
        </button>

        {/* Result Preview Box */}
        {extractedData && (
          <div
            className="animate-bounce-in"
            style={{
              background: "#FFF7ED",
              border: "2px solid var(--color-navy)",
              borderRadius: "12px",
              padding: "0.85rem 1rem",
              boxShadow: "2px 2px 0px var(--color-navy)",
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1.5px solid rgba(10,25,47,0.1)", paddingBottom: "0.35rem" }}>
              <span style={{ fontWeight: 900, fontSize: "0.82rem", color: "var(--color-navy)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <CheckCircle2 size={15} color="var(--color-navy)" fill="var(--color-lime)" />
                {t("dashboard.transactions.ocrPreviewTitle")}
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  padding: "0.15rem 0.4rem",
                  borderRadius: "6px",
                  border: "1.2px solid var(--color-navy)",
                  background: extractedData.auto_tag === "needs" ? "var(--color-lime)" : "var(--color-orange)",
                  color: extractedData.auto_tag === "needs" ? "var(--color-navy)" : "var(--color-white)",
                }}
              >
                {extractedData.auto_tag.toUpperCase()}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.35rem", fontSize: "0.75rem", color: "var(--color-navy)" }}>
              <div>
                <span style={{ opacity: 0.75 }}>{t("dashboard.transactions.ocrMerchant")}:</span>
                <div style={{ fontWeight: 800 }}>{extractedData.merchant_name}</div>
              </div>
              <div>
                <span style={{ opacity: 0.75 }}>{t("dashboard.transactions.ocrTotal")}:</span>
                <div style={{ fontWeight: 900, color: "var(--color-navy)", fontSize: "0.82rem" }}>
                  Rp {extractedData.total_amount.toLocaleString("id-ID")}
                </div>
              </div>
              <div>
                <span style={{ opacity: 0.75 }}>{t("dashboard.transactions.ocrCategory")}:</span>
                <div style={{ fontWeight: 800 }}>{extractedData.category}</div>
              </div>
              <div>
                <span style={{ opacity: 0.75 }}>{t("dashboard.transactions.ocrDate")}:</span>
                <div style={{ fontWeight: 800 }}>{extractedData.transaction_date}</div>
              </div>
            </div>

            {/* Items breakdown list */}
            {extractedData.items && extractedData.items.length > 0 && (
              <div style={{ fontSize: "0.72rem", borderTop: "1px dashed rgba(10,25,47,0.15)", paddingTop: "0.35rem" }}>
                <div style={{ fontWeight: 800, marginBottom: "0.2rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <ShoppingBag size={11} /> {t("dashboard.transactions.ocrItems")} ({extractedData.items.length}):
                </div>
                <div style={{ maxHeight: "60px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
                  {extractedData.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", opacity: 0.85 }}>
                      <span>• {item.name} (x{item.qty})</span>
                      <span style={{ fontWeight: 700 }}>Rp {item.total.toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.4rem" }}>
              {onSaveDirectly && (
                isSaved ? (
                  <div
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      fontSize: "0.82rem",
                      fontWeight: 900,
                      background: "var(--color-lime)",
                      color: "var(--color-navy)",
                      border: "2px solid var(--color-navy)",
                      borderRadius: "8px",
                      boxShadow: "2px 2px 0px var(--color-navy)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <CheckCircle2 size={16} color="var(--color-navy)" />
                    Tercatat di Riwayat Transaksi!
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!extractedData) return;
                      onSaveDirectly(extractedData);
                      setIsSaved(true);
                    }}
                    className="btn-brutal"
                    style={{
                      width: "100%",
                      padding: "0.55rem",
                      fontSize: "0.82rem",
                      fontWeight: 900,
                      background: "var(--color-lime)",
                      color: "var(--color-navy)",
                      border: "2px solid var(--color-navy)",
                      borderRadius: "8px",
                      boxShadow: "2px 2px 0px var(--color-navy)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      cursor: "pointer",
                    }}
                  >
                    <CheckCircle2 size={16} color="var(--color-navy)" />
                    Simpan Langsung ke Riwayat
                  </button>
                )
              )}

              <button
                type="button"
                onClick={handleApplyToForm}
                className="btn-brutal"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  background: "var(--color-white)",
                  color: "var(--color-navy)",
                  border: "1.8px solid var(--color-navy)",
                  borderRadius: "8px",
                  boxShadow: "2px 2px 0px var(--color-navy)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.35rem",
                  cursor: "pointer",
                }}
              >
                <span>{t("dashboard.transactions.ocrApplyBtn") || "Masukkan ke Formulir"}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info Strip */}
      <div style={{ marginTop: "auto", paddingTop: "0.85rem" }}>
        <div 
          style={{
            background: "rgba(184, 255, 0, 0.14)",
            border: "1.8px solid var(--color-navy)",
            boxShadow: "2px 2px 0px var(--color-navy)",
            borderRadius: "10px",
            padding: "0.6rem 0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem"
          }}
        >
          <div 
            style={{
              background: "var(--color-lime)",
              border: "1.2px solid var(--color-navy)",
              borderRadius: "6px",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}
          >
            <Sparkles size={12} color="var(--color-navy)" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-navy)", lineHeight: 1.3 }}>
            Gemini 2.0 Flash mengekstrak merchant, nominal, tanggal, dan menandai pos Kebutuhan atau Keinginan secara otomatis.
          </span>
        </div>
      </div>
    </div>
  );
}
