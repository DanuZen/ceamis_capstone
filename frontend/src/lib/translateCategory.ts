export const translateCategoryName = (category: string, t: any) => {
  const mapping: Record<string, string> = {
    // Income
    "Gaji": "dashboard.transactions.catSalary",
    "Salary": "dashboard.transactions.catSalary",
    "Bonus": "dashboard.transactions.catBonus",
    "Hasil Bisnis": "dashboard.transactions.catBusiness",
    "Business": "dashboard.transactions.catBusiness",
    "Lainnya": "dashboard.transactions.catOther",
    "Other": "dashboard.transactions.catOther",

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
    "Kopi & Jajan": "dashboard.transactions.catSnacks"
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
