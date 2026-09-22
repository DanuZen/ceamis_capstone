"use client";

import { Wallet, Plus, Coffee, Utensils, Car, ShoppingBag, Zap, Sparkles, TrendingUp, ArrowRight, Tag, Home, Gamepad2, Banknote, Brain, RefreshCw, ChevronDown, X, Laptop } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTransactions, TransactionType } from "@/context/TransactionContext";
import { useUser } from "@/context/UserContext";
import { aiApi } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/Toast";
import { translateCategoryName, translateClusterLabel } from "@/lib/translateCategory";
import ReceiptOcrCard from "./components/ReceiptOcrCard";
import PageBanner from "@/components/layout/PageBanner";

// ── Tipe response Model 2 (Spending Pattern Clustering) ──────────────────────
interface SpendingClusterResult {
  cluster_label: string;   // "Si Impulsif" | "Si Hemat" | "Si Boros"
  dominant_category: string;
  insight: string;
  needs_ratio: number;     // 0–100
  wants_ratio: number;     // 0–100
  savings_ratio: number;   // 0–100
  trend: "improving" | "stable" | "declining";
  is_mock: boolean;
}

// ── Fallback data saat API belum ready ────────────────────────────────────────
const MOCK_CLUSTER: SpendingClusterResult = {
  cluster_label: "Si Hemat",
  dominant_category: "Food & Drink",
  insight: "__mock__", // Will be replaced with t() at render time
  needs_ratio: 62,
  wants_ratio: 28,
  savings_ratio: 10,
  trend: "improving",
  is_mock: true,
};

const CLUSTER_COLORS: Record<string, string> = {
  "Si Hemat":    "var(--color-lime)",
  "Si Impulsif": "var(--color-orange)",
  "Si Boros":    "var(--color-pink)",
};

const CustomSelect = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: {key:string, label:string}[] }) => {
  const [open, setOpen] = useState(false);
  const selectedOpt = options.find(o => o.key === value) || options[0];

  return (
    <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column" }}>
      <button 
        type="button"
        onClick={() => setOpen(!open)}
        className="input-brutal"
        style={{ 
          border: "3px solid var(--color-navy)", padding: "1rem", fontSize: "1.125rem", fontWeight: 700, 
          width: "100%", boxShadow: "4px 4px 0px var(--color-navy)", display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "var(--color-bg)", cursor: "pointer", flex: 1
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-navy)" }}>
          {selectedOpt?.label || value}
        </span>
        <ChevronDown size={20} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "var(--color-navy)" }} />
      </button>
      
      {open && (
        <div className="no-scrollbar" style={{
          position: "absolute", top: "100%", left: 0, width: "100%", marginTop: "0.5rem",
          background: "var(--color-white)", border: "3px solid var(--color-navy)", borderRadius: "var(--radius-brutal-sm)",
          boxShadow: "4px 4px 0px var(--color-navy)", zIndex: 10, maxHeight: "250px", overflowY: "auto", display: "flex", flexDirection: "column"
        }}>
          {options.map(opt => {
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => { onChange(opt.key); setOpen(false); }}
                style={{
                  padding: "1rem", display: "flex", alignItems: "center", gap: "0.5rem", border: "none",
                  background: value === opt.key ? "var(--color-purple)" : "transparent",
                  color: value === opt.key ? "var(--color-white)" : "var(--color-navy)",
                  fontWeight: 800, textAlign: "left", cursor: "pointer", borderBottom: "2px solid rgba(10,25,47,0.05)",
                  fontSize: "1rem"
                }}
                onMouseEnter={(e) => { if(value !== opt.key) e.currentTarget.style.background = "var(--color-bg)" }}
                onMouseLeave={(e) => { if(value !== opt.key) e.currentTarget.style.background = "transparent" }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default function TransactionsPage() {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  const { addTransaction, transactions } = useTransactions();
  const { userData, updateUserData, unlockBadge } = useUser();

  const [desc, setDesc]       = useState("");
  const [amount, setAmount]   = useState("");  // stored as formatted string e.g. "100.000.000"
  const [amountRaw, setAmountRaw] = useState(""); // unformatted for parse
  const [type, setType]       = useState<TransactionType>("pengeluaran");
  const [tag, setTag]         = useState<"needs" | "wants" | "save">("needs");
  const [isQuickInput, setIsQuickInput] = useState(false);
  const [showTipsBubble, setShowTipsBubble] = useState(true);
  const [isClosingBubble, setIsClosingBubble] = useState(false);

  // Ensure main chat is closed when landing here to prioritize insight
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("cami-close-chat"));
  }, []);

  // Global click to close bubble
  useEffect(() => {
    if (!showTipsBubble || isClosingBubble) return;
    const timer = setTimeout(() => {
      const closeBubble = () => {
        setIsClosingBubble(true);
        setTimeout(() => setShowTipsBubble(false), 300); // Wait for animation
      };
      window.addEventListener("click", closeBubble);
      return () => window.removeEventListener("click", closeBubble);
    }, 100);
    return () => clearTimeout(timer);
  }, [showTipsBubble, isClosingBubble]);

  // Sync character pose
  useEffect(() => {
    // If showTipsBubble is true and we are not currently closing it, tell CAMI to open her mouth
    window.dispatchEvent(new CustomEvent("cami-force-open", { detail: showTipsBubble && !isClosingBubble }));
    return () => {
      window.dispatchEvent(new CustomEvent("cami-force-open", { detail: false }));
    };
  }, [showTipsBubble, isClosingBubble]);

  // Internal keys (fixed, language-independent) for category state
  const CATEGORY_KEYS = {
    pemasukan: ["Gaji Utama", "Bonus", "Hasil Bisnis", "Lainnya"],
    needs: ["Makanan & Minuman", "Transportasi", "Kesehatan", "Tagihan & Utilitas", "Kebutuhan Rumah"],
    wants: ["Belanja Pribadi", "Hiburan", "Hobi", "Jajan", "Liburan"],
    save: ["Alokasi Dana Darurat", "Reksadana", "Saham", "Mimpi / Target", "Kendaraan"]
  };

  const [category, setCategory] = useState(CATEGORY_KEYS.needs[0]);

  // ── Model 2 state ──────────────────────────────────────────────────────────
  const [cluster, setCluster]     = useState<SpendingClusterResult>(MOCK_CLUSTER);
  const [loadingCluster, setLoadingCluster] = useState(false);

  const [dynamicNeeds, setDynamicNeeds] = useState<string[]>([]);
  const [dynamicWants, setDynamicWants] = useState<string[]>([]);
  const [dynamicSavings, setDynamicSavings] = useState<string[]>([]);

  useEffect(() => {
    try {
      const budgetData = localStorage.getItem("ceamis_budget");
      if (budgetData) {
        const parsed = JSON.parse(budgetData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDynamicNeeds(parsed.filter((b: any) => b.type === "needs").map((b: any) => b.name));
          setDynamicWants(parsed.filter((b: any) => b.type === "wants").map((b: any) => b.name));
          setDynamicSavings(parsed.filter((b: any) => b.type === "savings").map((b: any) => b.name));
        }
      }
    } catch (e) {}
  }, []);

  const currentCategoryOptions = {
    ...CATEGORY_KEYS,
    needs: dynamicNeeds.length > 0 ? dynamicNeeds : CATEGORY_KEYS.needs,
    wants: dynamicWants.length > 0 ? dynamicWants : CATEGORY_KEYS.wants,
    save: dynamicSavings.length > 0 ? dynamicSavings : CATEGORY_KEYS.save
  };

  // Auto-update category when type, tag, or language changes
  useEffect(() => {
    if (type === "pemasukan") {
      if (!currentCategoryOptions.pemasukan.includes(category)) {
        setCategory(currentCategoryOptions.pemasukan[0]);
      }
    } else {
      const allowed = currentCategoryOptions[tag] || [];
      if (!allowed.includes(category)) {
        setCategory(allowed[0] || "");
      }
    }
  }, [type, tag, dynamicNeeds, dynamicWants, dynamicSavings, language]);

  // ── Hitung category_breakdown dari transaksi yang ada ─────────────────────
  const buildCategoryBreakdown = useCallback(() => {
    const breakdown: Record<string, number> = {};
    transactions
      .filter(tx => tx.type === "pengeluaran")
      .forEach(tx => {
        const catStr = tx.category.toLowerCase();
        let mlCat = "cat_kebutuhan_pokok"; // default
        
        if (catStr.includes("makan") || catStr.includes("food") || catStr.includes("snack") || catStr.includes("cemil") || catStr.includes("minum")) mlCat = "cat_f&b";
        else if (catStr.includes("transport") || catStr.includes("kendaraan") || catStr.includes("vehicle") || catStr.includes("bensin")) mlCat = "cat_transportasi";
        else if (catStr.includes("sehat") || catStr.includes("health") || catStr.includes("medis") || catStr.includes("obat")) mlCat = "cat_kesehatan";
        else if (catStr.includes("tagih") || catStr.includes("bill") || catStr.includes("listrik") || catStr.includes("air") || catStr.includes("home") || catStr.includes("rumah")) mlCat = "cat_tagihan";
        else if (catStr.includes("hibur") || catStr.includes("entertain") || catStr.includes("holiday") || catStr.includes("libur")) mlCat = "cat_hiburan";
        else if (catStr.includes("hobi") || catStr.includes("hobby")) mlCat = "cat_hobi";
        else if (catStr.includes("belanja") || catStr.includes("shop") || catStr.includes("baju") || catStr.includes("fashion")) mlCat = "cat_fashion";
        else if (catStr.includes("elektronik") || catStr.includes("gadget") || catStr.includes("hp")) mlCat = "cat_elektronik";
        else if (catStr.includes("didik") || catStr.includes("school") || catStr.includes("sekolah") || catStr.includes("edu")) mlCat = "cat_pendidikan";
        
        breakdown[mlCat] = (breakdown[mlCat] || 0) + tx.amount;
      });
    return breakdown;
  }, [transactions]);

  // ── Fetch Model 2 dari AI service ─────────────────────────────────────────
  const fetchCluster = useCallback(async () => {
    const breakdown = buildCategoryBreakdown();
    if (Object.keys(breakdown).length === 0) return; // tidak ada data transaksi

    // Hitung rasio manual sebagai fallback dinamis
    let totalNeeds = 0;
    let totalWants = 0;
    let totalSave = 0;
    transactions.forEach(tx => {
      if (tx.type === "pengeluaran") {
        if (tx.tag === "needs") totalNeeds += tx.amount;
        else if (tx.tag === "wants") totalWants += tx.amount;
        else if (tx.tag === "save") totalSave += tx.amount;
      }
    });
    const totalOut = totalNeeds + totalWants + totalSave;
    const dynamicNeedsRatio = totalOut > 0 ? Math.round((totalNeeds / totalOut) * 100) : 60;
    const dynamicWantsRatio = totalOut > 0 ? Math.round((totalWants / totalOut) * 100) : 30;
    const dynamicSaveRatio = totalOut > 0 ? Math.round((totalSave / totalOut) * 100) : 10;
    
    const rawTopCat = Object.keys(breakdown).length > 0 
      ? Object.keys(breakdown).reduce((a, b) => breakdown[a] > breakdown[b] ? a : b) 
      : "Lainnya";
    
    // Map internal key to display name — use neutral/English keys for internal storage
    const catMap: Record<string, string> = {
      "cat_f&b": "Food & Drink", "cat_transportasi": "Transportation", "cat_kesehatan": "Health",
      "cat_tagihan": "Bills & Utilities", "cat_hiburan": "Entertainment", "cat_hobi": "Hobby",
      "cat_fashion": "Shopping", "cat_elektronik": "Electronics", "cat_pendidikan": "Education",
      "cat_kebutuhan_pokok": "Essential Needs"
    };
    const topCategory = catMap[rawTopCat] || "Other";

    setLoadingCluster(true);
    try {
      const data = await aiApi.getSpendingCluster({
        user_id: userData.id || "guest"
      });

      // Map respons API → state lokal
      const rData = data;
      if (rData && !rData.is_mock) {
        setCluster({
          cluster_label:      rData.cluster_label || MOCK_CLUSTER.cluster_label,
          dominant_category:  topCategory, // Selalu gunakan hasil hitungan real
          insight:            rData.insight || "__mock__",
          needs_ratio:        rData.needs_ratio !== undefined ? rData.needs_ratio : dynamicNeedsRatio,
          wants_ratio:        rData.wants_ratio !== undefined ? rData.wants_ratio : dynamicWantsRatio,
          savings_ratio:      rData.savings_ratio !== undefined ? rData.savings_ratio : dynamicSaveRatio,
          trend:              rData.trend || "stable",
          is_mock:            false,
        });

        if (rData.cluster_label) {
          updateUserData({ label: rData.cluster_label });
          localStorage.setItem("ceamis_cluster_label", rData.cluster_label);
        }
      } else {
        throw new Error("API mock data or fallback required");
      }
    } catch {
      // Fallback: dynamic calculation
      let dynamicLabel = "Si Hemat";
      if (dynamicWantsRatio > 50) dynamicLabel = "Si Boros";
      else if (dynamicNeedsRatio < 40 && dynamicWantsRatio > 30) dynamicLabel = "Si Impulsif";

      const dynamicCluster = {
        ...MOCK_CLUSTER,
        cluster_label: dynamicLabel,
        dominant_category: topCategory,
        needs_ratio: dynamicNeedsRatio,
        wants_ratio: dynamicWantsRatio,
        savings_ratio: dynamicSaveRatio,
        insight: "__mock__" // Will be replaced with translated text at render
      };
      setCluster(dynamicCluster);
      updateUserData({ label: dynamicCluster.cluster_label });
      localStorage.setItem("ceamis_cluster_label", dynamicCluster.cluster_label);
    } finally {
      setLoadingCluster(false);
    }
  }, [buildCategoryBreakdown, transactions, userData.id, updateUserData]);

  // Auto-fetch saat transaksi berubah
  useEffect(() => {
    fetchCluster();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions.length]);

  const handleQuickInput = (presetDesc: string, presetAmount: string, presetType: TransactionType = "pengeluaran") => {
    setDesc(presetDesc);
    setAmountRaw(presetAmount);
    setAmount(presetAmount.replace(/\B(?=(\d{3})+(?!\d))/g, "."));
    setType(presetType);
    setIsQuickInput(true);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
  };

  return (
    <div style={{ paddingBottom: "1.5rem" }}>
      {/* Header Banner */}
      <PageBanner
        badgeText="PENCATATAN KEUANGAN"
        title="Catat & Pindai Transaksi"
        description="Catat pengeluaran atau pemasukan secara manual maupun otomatis dengan pindai struk cerdas OCR."
        rightCard={{
          icon: <Wallet size={24} className="text-[#1d4ed8]" />,
          label: "TOTAL TRANSAKSI",
          value: `${transactions.length} Dicatat`,
        }}
        className="mb-4"
      />



      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
        {/* Smart OCR Scan Struk Section (Replaces Quick Input) */}
        <div className="lg:col-span-5 flex flex-col">
          <ReceiptOcrCard
            onApplyData={(parsed) => {
              // 1. Deskripsi / Merchant
              let merchant = (parsed.merchant_name || "").trim();
              if (/^(STK|INV|TRX|STRUK|ID|NO)[-:\s#]/i.test(merchant) && parsed.items?.[0]?.name) {
                merchant = parsed.items[0].name;
              }
              setDesc(merchant || "Belanja Struk");

              // 2. Nominal
              const amtNum = parsed.total_amount || 0;
              setAmountRaw(amtNum.toString());
              setAmount(amtNum > 0 ? amtNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "");

              // 3. Tipe & Tag
              setType("pengeluaran");
              const newTag = parsed.auto_tag === "wants" ? "wants" : "needs";
              setTag(newTag);

              // 4. Pemetaan Kategori ke Opsi Bahasa Indonesia
              const catRaw = (parsed.category || "").toLowerCase();
              let targetCat = "Makanan & Minuman";

              if (catRaw.includes("grocer") || catRaw.includes("supermarket") || catRaw.includes("pasar") || catRaw.includes("rumah")) {
                targetCat = "Kebutuhan Rumah";
              } else if (catRaw.includes("food") || catRaw.includes("beverage") || catRaw.includes("makan") || catRaw.includes("minum") || catRaw.includes("resto")) {
                targetCat = "Makanan & Minuman";
              } else if (catRaw.includes("transport") || catRaw.includes("bensin") || catRaw.includes("ojol")) {
                targetCat = "Transportasi";
              } else if (catRaw.includes("util") || catRaw.includes("tagihan") || catRaw.includes("listrik")) {
                targetCat = "Tagihan & Utilitas";
              } else if (catRaw.includes("health") || catRaw.includes("sehat") || catRaw.includes("obat") || catRaw.includes("apotek")) {
                targetCat = "Kesehatan";
              } else if (catRaw.includes("shop") || catRaw.includes("belanja") || catRaw.includes("fashion") || catRaw.includes("baju")) {
                targetCat = "Belanja Pribadi";
              } else if (catRaw.includes("entertain") || catRaw.includes("hibur") || catRaw.includes("bioskop") || catRaw.includes("game")) {
                targetCat = "Hiburan";
              } else if (catRaw.includes("hobi") || catRaw.includes("hobby")) {
                targetCat = "Hobi";
              }

              const validOptions = currentCategoryOptions[newTag] || currentCategoryOptions.needs;
              if (validOptions.includes(targetCat)) {
                setCategory(targetCat);
              } else {
                setCategory(validOptions[0]);
              }
            }}
            onSaveDirectly={async (parsed) => {
              // 1. Deskripsi / Merchant
              let merchant = (parsed.merchant_name || "").trim();
              if (/^(STK|INV|TRX|STRUK|ID|NO)[-:\s#]/i.test(merchant) && parsed.items?.[0]?.name) {
                merchant = parsed.items[0].name;
              }
              const finalDesc = merchant || "Belanja Struk";

              // 2. Nominal
              const amtNum = parsed.total_amount || 0;

              // 3. Tipe & Tag
              const newTag = parsed.auto_tag === "wants" ? "wants" : "needs";

              // 4. Pemetaan Kategori ke Opsi Bahasa Indonesia
              const catRaw = (parsed.category || "").toLowerCase();
              let targetCat = "Makanan & Minuman";

              if (catRaw.includes("grocer") || catRaw.includes("supermarket") || catRaw.includes("pasar") || catRaw.includes("rumah")) {
                targetCat = "Kebutuhan Rumah";
              } else if (catRaw.includes("food") || catRaw.includes("beverage") || catRaw.includes("makan") || catRaw.includes("minum") || catRaw.includes("resto")) {
                targetCat = "Makanan & Minuman";
              } else if (catRaw.includes("transport") || catRaw.includes("bensin") || catRaw.includes("ojol")) {
                targetCat = "Transportasi";
              } else if (catRaw.includes("util") || catRaw.includes("tagihan") || catRaw.includes("listrik")) {
                targetCat = "Tagihan & Utilitas";
              } else if (catRaw.includes("health") || catRaw.includes("sehat") || catRaw.includes("obat") || catRaw.includes("apotek")) {
                targetCat = "Kesehatan";
              } else if (catRaw.includes("shop") || catRaw.includes("belanja") || catRaw.includes("fashion") || catRaw.includes("baju")) {
                targetCat = "Belanja Pribadi";
              } else if (catRaw.includes("entertain") || catRaw.includes("hibur") || catRaw.includes("bioskop") || catRaw.includes("game")) {
                targetCat = "Hiburan";
              } else if (catRaw.includes("hobi") || catRaw.includes("hobby")) {
                targetCat = "Hobi";
              }

              const validOptions = currentCategoryOptions[newTag] || currentCategoryOptions.needs;
              const finalCat = validOptions.includes(targetCat) ? targetCat : validOptions[0];

              await addTransaction({
                description: finalDesc,
                amount: amtNum,
                type: "pengeluaran",
                category: finalCat,
                tag: newTag,
              });
              unlockBadge("firstStep");
              showToast(`Transaksi "${finalDesc}" (Rp ${amtNum.toLocaleString("id-ID")}) berhasil dicatat ke riwayat!`, "success");

              // Reset input form
              setDesc("");
              setAmount("");
              setAmountRaw("");
            }}
          />
        </div>

        {/* Form Section */}
        <div className="lg:col-span-7 flex flex-col animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="card-brutal" style={{ height: "100%", minHeight: "560px", background: "var(--color-white)", border: "2.5px solid var(--color-navy)", borderRadius: "16px", padding: "1.25rem 1.5rem", boxShadow: "4px 4px 0px var(--color-navy)", display: "flex", flexDirection: "column", justifyContent: "space-between", boxSizing: "border-box" }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.1rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: "34px", height: "34px", background: "var(--color-purple)", border: "2px solid var(--color-navy)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "2px 2px 0px var(--color-navy)", flexShrink: 0 }}>
                  <Plus size={17} color="var(--color-white)" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 900, color: "var(--color-navy)", margin: 0, lineHeight: 1.2 }}>{t("dashboard.transactions.formTitle")}</h3>
                  <p style={{ fontSize: "0.7rem", color: "#64748B", fontWeight: 600, margin: "2px 0 0 0" }}>
                    {t("dashboard.transactions.formDesc")}
                  </p>
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!desc || !amount) return;
                addTransaction({ description: desc, amount: parseFloat(amountRaw.replace(/\./g, "")), type, category, tag });
                unlockBadge("firstStep");
                showToast(t("dashboard.transactions.savedSuccess") || "Transaksi aman tersimpan, cuy!", "success");
                setDesc(""); setAmount(""); setAmountRaw(""); setIsQuickInput(false);
              }}
              style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}
            >
              <div>
                <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.82rem", display: "block", marginBottom: "0.35rem", color: "var(--color-navy)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  {type === "pemasukan" ? t("dashboard.transactions.formIncomeLabel") : tag === "save" ? t("dashboard.transactions.formSaveLabel") : t("dashboard.transactions.formExpenseLabel")}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="input-brutal"
                    placeholder={
                      type === "pemasukan" ? t("dashboard.transactions.formIncomePlaceholder") :
                      tag === "save" ? t("dashboard.transactions.formSavePlaceholder") :
                      t("dashboard.transactions.formExpensePlaceholder")
                    }
                    style={{ border: "2px solid var(--color-navy)", padding: "0.6rem 0.75rem", paddingRight: isQuickInput ? "2.5rem" : "0.75rem", fontSize: "0.9rem", width: "100%", borderRadius: "10px", boxShadow: "2px 2px 0px var(--color-navy)", background: "var(--color-bg)", boxSizing: "border-box" }}
                  />
                  {isQuickInput && (
                    <button
                      type="button"
                      onClick={() => setIsQuickInput(false)}
                      style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "0.25rem" }}
                      title="Batal One Click"
                    >
                      <X size={20} color="var(--color-text-muted)" />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.82rem", display: "block", marginBottom: "0.35rem", color: "var(--color-navy)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    {t("dashboard.transactions.amountLabel")}
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", fontSize: "0.85rem", fontWeight: 800, color: "var(--color-navy)" }}>Rp</span>
                    <input
                      value={amount}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        setAmountRaw(raw);
                        setAmount(raw ? raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "");
                      }}
                      className="input-brutal"
                      type="text"
                      inputMode="numeric"
                      min="0"
                      placeholder="0"
                      style={{ border: "2px solid var(--color-navy)", padding: "0.6rem 0.75rem 0.6rem 2.2rem", fontSize: "0.9rem", width: "100%", fontWeight: 800, borderRadius: "10px", boxShadow: "2px 2px 0px var(--color-navy)", background: "var(--color-bg)", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.82rem", display: "block", marginBottom: "0.35rem", color: "var(--color-navy)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    {t("dashboard.transactions.typeLabel")}
                  </label>
                  {isQuickInput ? (
                    <div className="input-brutal" style={{ border: "2px solid var(--color-navy)", padding: "0.6rem 0.75rem", fontSize: "0.9rem", width: "100%", fontWeight: 800, borderRadius: "10px", boxShadow: "2px 2px 0px var(--color-navy)", background: "#e2e8f0", color: "var(--color-text-muted)" }}>
                      {type === "pemasukan" ? t("dashboard.transactions.income") : t("dashboard.transactions.expense")}
                    </div>
                  ) : (
                    <CustomSelect
                      value={type}
                      onChange={(v) => setType(v as TransactionType)}
                      options={[
                        { key: "pengeluaran", label: t("dashboard.transactions.expense") },
                        { key: "pemasukan", label: t("dashboard.transactions.income") }
                      ]}
                    />
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: type === "pemasukan" ? "1fr" : "1.5fr 1fr", gap: "0.75rem" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.82rem", display: "block", marginBottom: "0.35rem", color: "var(--color-navy)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                    {t("dashboard.transactions.categoryLabel")}
                  </label>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <CustomSelect
                      value={category}
                      onChange={(v) => handleCategoryChange(v)}
                      options={(type === "pemasukan" ? currentCategoryOptions.pemasukan : currentCategoryOptions[tag]).map(cat => ({ key: cat, label: translateCategoryName(cat, t) }))}
                    />
                  </div>
                </div>

                {type !== "pemasukan" && (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.82rem", display: "block", marginBottom: "0.35rem", color: "var(--color-navy)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                      <Tag size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "0.25rem" }} />{t("dashboard.transactions.priorityLabel")}
                    </label>
                    <div style={{ display: "flex", gap: "0.5rem", flex: 1 }}>
                      <button type="button" onClick={() => setTag("needs")} className="btn-brutal" style={{
                        flex: 1, padding: "0.75rem 0.25rem", fontWeight: 800, fontSize: "0.85rem",
                        background: tag === "needs" ? "var(--color-lime)" : "var(--color-white)",
                        transform: tag === "needs" ? "translate(-2px, -2px)" : "none",
                        boxShadow: tag === "needs" ? "4px 4px 0px var(--color-navy)" : "2px 2px 0px var(--color-navy)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem",
                      }}>
                        <Home size={12} /> Need
                      </button>
                      <button type="button" onClick={() => setTag("wants")} className="btn-brutal" style={{
                        flex: 1, padding: "0.75rem 0.25rem", fontWeight: 800, fontSize: "0.85rem",
                        background: tag === "wants" ? "var(--color-orange)" : "var(--color-white)",
                        color: tag === "wants" ? "var(--color-white)" : "var(--color-navy)",
                        transform: tag === "wants" ? "translate(-2px, -2px)" : "none",
                        boxShadow: tag === "wants" ? "4px 4px 0px var(--color-navy)" : "2px 2px 0px var(--color-navy)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem",
                      }}>
                        <Gamepad2 size={12} /> Want
                      </button>
                      <button type="button" onClick={() => setTag("save")} className="btn-brutal" style={{
                        flex: 1, padding: "0.75rem 0.25rem", fontWeight: 800, fontSize: "0.85rem",
                        background: tag === "save" ? "var(--color-purple)" : "var(--color-white)",
                        color: tag === "save" ? "var(--color-white)" : "var(--color-navy)",
                        transform: tag === "save" ? "translate(-2px, -2px)" : "none",
                        boxShadow: tag === "save" ? "4px 4px 0px var(--color-navy)" : "2px 2px 0px var(--color-navy)",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem",
                      }}>
                        <Banknote size={12} /> Save
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: "auto", paddingTop: "0.75rem" }}>
                <button
                  type="submit"
                  className="btn-brutal btn-brutal--primary"
                  style={{
                    width: "100%", padding: "0.85rem", fontSize: "1rem", fontWeight: 900,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    background: "var(--color-lime)", color: "var(--color-navy)",
                    border: "2px solid var(--color-navy)", borderRadius: "10px",
                    boxShadow: "3px 3px 0px var(--color-navy)", cursor: "pointer"
                  }}
                >
                  {t("dashboard.transactions.saveTransaction")} <Sparkles size={18} />
                </button>
              </div>
            </form>
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
                  Setiap transaksi otomatis terintegrasi ke Planning, History, dan Reports secara real-time.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CAMI Tips Bubble Overlay */}
      {showTipsBubble && (
        <>
          <style>{`
            @keyframes pop-bubble {
              0% { transform: scale(0.8) translateY(10px); opacity: 0; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            @keyframes pop-bubble-out {
              0% { transform: scale(1) translateY(0); opacity: 1; }
              100% { transform: scale(0.8) translateY(10px); opacity: 0; }
            }
          `}</style>
          <div style={{
            position: "fixed", bottom: "160px", right: "260px", zIndex: 990,
            animation: isClosingBubble
              ? "pop-bubble-out 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
              : "pop-bubble 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            width: "300px", cursor: "pointer", transition: "transform 0.2s"
          }} 
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {/* Tail Shadow */}
            <div style={{
              position: "absolute", bottom: "32px", right: "-20px",
              width: "24px", height: "24px",
              background: "var(--color-navy)",
              transform: "rotate(45deg)",
              zIndex: 989,
            }} />
            {/* Tail Main (Higher z-index to cover content border) */}
            <div style={{
              position: "absolute", bottom: "40px", right: "-12px",
              width: "24px", height: "24px",
              background: "#FFF7ED",
              borderRight: "3px solid var(--color-navy)",
              borderTop: "3px solid var(--color-navy)",
              transform: "rotate(45deg)",
              zIndex: 991,
            }} />
            {/* Bubble content */}
            <div style={{
              position: "relative", zIndex: 990,
              background: "#FFF7ED", border: "3px solid var(--color-navy)",
              borderRadius: "var(--radius-brutal-sm)", padding: "1.25rem",
              boxShadow: "6px 6px 0px var(--color-navy)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 900, color: "#1d4ed8", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Sparkles size={14} color="#1d4ed8" /> {t("dashboard.transactions.tipsTitle")}
                </div>
              </div>
              <p style={{ fontSize: "0.95rem", color: "var(--color-navy)", margin: 0, lineHeight: 1.5, fontWeight: 700 }}>
                "{t("dashboard.transactions.tipsDesc").replace(/^"|"$/g, '')}"
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
