export const translateCategoryName = (category: string, t: any) => {
  const mapping: Record<string, string> = {
    // Income
    "Gaji": "dashboard.transactions.catSalary",
    "Gaji Utama": "dashboard.transactions.catSalary",
    "Salary": "dashboard.transactions.catSalary",
    "Bonus": "dashboard.transactions.catBonus",
    "Hasil Bisnis": "dashboard.transactions.catBusiness",
    "Business": "dashboard.transactions.catBusiness",
    "Lainnya": "dashboard.transactions.catOther",
    "Other": "dashboard.transactions.catOther",
    "Pemasukan Lainnya": "dashboard.transactions.catOther",
    "Pinjaman Masuk": "dashboard.transactions.catDebtIn",

    // Needs
    "Makanan & Minuman": "dashboard.transactions.catFood",
    "Food & Drink": "dashboard.transactions.catFood",
    "Transportasi": "dashboard.transactions.catTransport",
    "Transport": "dashboard.transactions.catTransport",
    "Kesehatan": "dashboard.transactions.catHealth",
    "Health": "dashboard.transactions.catHealth",
    "Tagihan & Utilitas": "dashboard.transactions.catBills",
    "Bills & Utilities": "dashboard.transactions.catBills",
    "Kebutuhan Rumah": "dashboard.transactions.catHome",
    "Home Needs": "dashboard.transactions.catHome",

    // Wants
    "Belanja": "dashboard.transactions.catShopping",
    "Belanja Pribadi": "dashboard.transactions.catShopping",
    "Shopping": "dashboard.transactions.catShopping",
    "Hiburan": "dashboard.transactions.catEntertainment",
    "Entertainment": "dashboard.transactions.catEntertainment",
    "Hobi": "dashboard.transactions.catHobby",
    "Hobby": "dashboard.transactions.catHobby",
    "Jajan": "dashboard.transactions.catSnacks",
    "Snacks": "dashboard.transactions.catSnacks",
    "Liburan": "dashboard.transactions.catHoliday",
    "Holiday": "dashboard.transactions.catHoliday",

    // Savings
    "Dana Darurat": "dashboard.transactions.catEmergency",
    "Alokasi Dana Darurat": "dashboard.transactions.catEmergency",
    "Emergency Fund": "dashboard.transactions.catEmergency",
    "Reksadana": "dashboard.transactions.catMutualFund",
    "Mutual Fund": "dashboard.transactions.catMutualFund",
    "Saham": "dashboard.transactions.catStock",
    "Stock": "dashboard.transactions.catStock",
    "Mimpi / Target": "dashboard.transactions.catDream",
    "Dream / Target": "dashboard.transactions.catDream",
    "Kendaraan": "dashboard.transactions.catVehicle",
    "Vehicle": "dashboard.transactions.catVehicle",

    // Planning aliases
    "Makan & Minum": "dashboard.transactions.catFood",
    "Hiburan & Rekreasi": "dashboard.transactions.catEntertainment",
    "Belanja & Lifestyle": "dashboard.transactions.catShopping",
    "Kopi & Jajan": "dashboard.transactions.catSnacks",

    // Debts & Loans
    "Utang": "dashboard.transactions.catDebtPay",
    "Piutang Keluar": "dashboard.transactions.catLoanOut",
    "Bayar Utang": "dashboard.transactions.catDebtPay",

    // English internal keys (used by AI cluster catMap)
    "Transportation": "dashboard.transactions.catTransport",
    "Electronics": "dashboard.transactions.catHobby",
    "Education": "dashboard.transactions.catDream",
    "Essential Needs": "dashboard.transactions.catHome"
  };

  const translationKey = mapping[category];
  if (translationKey) {
    const translated = t(translationKey);
    // If the translation returns the key itself, it means it's missing, so fallback to category
    if (translated && translated !== translationKey) {
      return translated;
    }
  }
  return category;
};

export const translateTransactionDesc = (desc: string, t: any) => {
  if (!desc) return desc;
  
  if (desc.startsWith("Membayar utang ke ")) {
    return `${t("dashboard.transactions.descPayDebt")} ${desc.replace("Membayar utang ke ", "")}`;
  }
  if (desc.startsWith("Terima pinjaman dari ")) {
    return `${t("dashboard.transactions.descReceiveLoan")} ${desc.replace("Terima pinjaman dari ", "")}`;
  }
  if (desc.startsWith("Pelunasan piutang dari ")) {
    return `${t("dashboard.transactions.descReceiveDebtPay")} ${desc.replace("Pelunasan piutang dari ", "")}`;
  }
  if (desc.startsWith("Beri pinjaman ke ")) {
    return `${t("dashboard.transactions.descGiveLoan")} ${desc.replace("Beri pinjaman ke ", "")}`;
  }
  return desc;
};

export const translateClusterLabel = (label: string, t: any) => {
  if (!label) return "";
  const keyMap: Record<string, string> = {
    "Si Hemat": "dashboard.transactions.labelHemat",
    "Si Boros": "dashboard.transactions.labelBoros",
    "Si Impulsif": "dashboard.transactions.labelImpulsif",
    "Pemula": "dashboard.beginnerBadge"
  };
  const cleanLabel = label.replace(" (Mock)", "");
  const key = keyMap[cleanLabel] || "";
  
  if (key) {
    const translated = t(key);
    if (translated && translated !== key) return translated;
  }
  return label;
};

export const translateRiskProfile = (profile: string, t: any) => {
  if (!profile) return profile;
  const keyMap: Record<string, string> = {
    "Konservatif": "dashboard.planning.profileConservative",
    "Moderat":     "dashboard.planning.profileModerate",
    "Agresif":     "dashboard.planning.profileAggressive",
  };
  const key = keyMap[profile];
  if (key) {
    const translated = t(key);
    if (translated && translated !== key) return translated;
  }
  return profile;
};
