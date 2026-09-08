# Design System & Style Guide — CEAMIS 2.0 (Neo-Brutalism)

**Filosofi Desain:** *Neo-Brutalism for Gen-Z*  
**Karakter Visual:** Tegas, Kontras Tinggi, Playful, Tanpa Basa-basi, Jujur secara Struktural (*Raw & Functional*).  
**Cakupan:** Web App (Next.js CSS) & Mobile App (Flutter Theme).

---

## 1. Prinsip Utama Desain

1. **High Contrast & Hard Borders:** Semua elemen interaktif memiliki garis luar (*border*) hitam pekat minimal `2px` hingga `3px`.
2. **Hard Drop Shadows (Zero Blur):** Tidak menggunakan *soft shadow* atau gaussian blur. Semua bayangan berupa blok warna solid offset `3px` hingga `5px` ke arah kanan-bawah (`#000000`).
3. **Vibrant & Tailored Palette:** Menggabungkan warna latar netral yang nyaman di mata dengan aksen warna pop-art elektrik (*Lime, Cyber Yellow, Vivid Purple*).
4. **Micro-Interactions (Click Offset):** Ketika tombol atau kartu ditekan (*active/hover*), elemen bergeser `2px` ke arah bayangan untuk memberikan sensasi taktil mekanik nyata.

---

## 2. Palet Warna (Color Palette)

### 2.1 Warna Utama & Netral
| Token | Hex Code | Nama Visual | Penggunaan Utama |
| :--- | :--- | :--- | :--- |
| `--color-dark` | `#0F172A` / `#000000` | Jet Black / Deep Slate | Border semua komponen, teks utama, bayangan solid |
| `--color-cream` | `#F8FAFC` / `#FFFDF9` | Warm Alabaster | Latar belakang (*background*) halaman utama |
| `--color-surface` | `#FFFFFF` | Crisp White | Latar kartu (*cards*), kontainer input, modal |

### 2.2 Warna Aksen Elektrik
| Token | Hex Code | Nama Visual | Karakteristik Penggunaan |
| :--- | :--- | :--- | :--- |
| `--color-lime` | `#A3E635` / `#84CC16` | Electric Lime | Tombol CTA primer, indikator saving rate tinggi, streak |
| `--color-yellow` | `#FACC15` | Cyber Yellow | Kartu highlight, level/badge penghargaan, peringatan sedang |
| `--color-purple` | `#A855F7` | Cosmic Purple | Chatbot CAMI branding, insight AI, kategori wants |
| `--color-cyan` | `#38BDF8` | Neon Sky | Edukasi & kuis, filter transaksi, kategori needs |

### 2.3 Warna Semantik & Status
| Token | Hex Code | Makna Status |
| :--- | :--- | :--- |
| `--color-danger` | `#EF4444` | Pengeluaran boros, krisis keuangan, error, hapus data |
| `--color-warning`| `#F59E0B` | Overbudget mendekati limit, warning trigger |
| `--color-success`| `#10B981` | Pemasukan, target tabungan tercapai, jawaban kuis benar |

---

## 3. Tipografi (Typography)

* **Font Utama (Body & UI):** `Plus Jakarta Sans` atau `Outfit` (Modern, sangat terbaca di layar HP).
* **Font Display (Heading & Skor):** `Syne` atau `Space Grotesk` (Geometrik, tegas, berkarakter brutal).

| Tingkat | Ukuran Font | Weight | Line Height | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| **Display (Skor)** | 40px – 48px | 900 (Black) | 1.1 | Skor Kesehatan Finansial, Nominal Saldo |
| **Heading 1** | 28px – 32px | 800 (ExtraBold) | 1.2 | Judul Halaman Utama |
| **Heading 2** | 20px – 24px | 800 (ExtraBold) | 1.3 | Judul Bagian / Kartu Modul |
| **Heading 3** | 16px – 18px | 700 (Bold) | 1.4 | Subjudul & Label Field Form |
| **Body Text** | 14px – 15px | 500 (Medium) | 1.5 | Paragraf penjelasan, pesan chat CAMI |
| **Caption / Meta** | 12px | 600 (SemiBold) | 1.4 | Tanggal transaksi, tag kategori, XP reward |

---

## 4. Spesifikasi Komponen

### 4.1 Tombol (Buttons)
* **Border:** `2.5px solid #000000`
* **Border Radius:** `8px` (*rounded-brutal*) atau `4px` (*sharp-brutal*)
* **Shadow:** `4px 4px 0px #000000`
* **Interaksi (Hover / Active):**
  ```css
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #000000;
  ```

### 4.2 Kartu Konten (Cards)
* **Border:** `2.5px solid #000000`
* **Background:** `#FFFFFF`
* **Shadow:** `4px 4px 0px #000000` (dapat diberi variasi warna bayangan, misal aksen lime/yellow)
* **Padding:** `1.25rem` (Web) / `1rem` (Mobile)

### 4.3 Tag Finansial (Financial Tags)
Digunakan wajib pada seluruh transaksi dan hasil OCR:
* **Tag Needs (Kebutuhan Pokok):** Background `#38BDF8` (Cyan), Border `1.5px solid #000`, Text Black.
* **Tag Wants (Keinginan / Gaya Hidup):** Background `#F472B6` (Pink) / `#A855F7` (Purple), Border `1.5px solid #000`.
* **Tag Save (Tabungan & Investasi):** Background `#A3E635` (Lime), Border `1.5px solid #000`.

### 4.4 Mobile Specific Components (Flutter)
* **Bottom Navigation Bar:**
  * Background putih tebal dengan border atas `3px solid #000000`.
  * Ikon aktif memiliki pill latar belakang kuning/lime dengan border hitam tipis.
* **Scanner Viewfinder:**
  * Garis panduan bidik kamera berwarna kuning kontras dengan aksen sudut hitam tebal.
* **Bottom Sheet Review OCR:**
  * Muncul dari bawah dengan border melingkar atas `16px`, border hitam `3px`, dan tombol konfirmasi lime di bagian bawah.

---

## 5. Referensi Kode Desain

### 5.1 Implementasi CSS Tokens (Web)
```css
:root {
  --color-dark: #0f172a;
  --color-cream: #fffdf9;
  --color-surface: #ffffff;
  --color-lime: #a3e635;
  --color-yellow: #facc15;
  --color-purple: #a855f7;
  --color-cyan: #38bdf8;
  --color-danger: #ef4444;

  --border-brutal: 2.5px solid var(--color-dark);
  --shadow-brutal: 4px 4px 0px var(--color-dark);
  --shadow-brutal-sm: 2px 2px 0px var(--color-dark);
  --radius-brutal: 8px;
}
```

### 5.2 Implementasi Flutter Theme Tokens (Mobile)
```dart
class CeamisColors {
  static const dark = Color(0xFF0F172A);
  static const cream = Color(0xFFFFFDF9);
  static const surface = Color(0xFFFFFFFF);
  static const lime = Color(0xFFA3E635);
  static const yellow = Color(0xFFFACC15);
  static const purple = Color(0xFFA855F7);
  static const cyan = Color(0xFF38BDF8);
  static const danger = Color(0xFFEF4444);
}

class CeamisDecoration {
  static BoxDecoration brutalBox({
    Color background = CeamisColors.surface,
    double radius = 8.0,
    double offsetX = 4.0,
    double offsetY = 4.0,
  }) {
    return BoxDecoration(
      color: background,
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(color: CeamisColors.dark, width: 2.5),
      boxShadow: [
        BoxShadow(
          color: CeamisColors.dark,
          offset: Offset(offsetX, offsetY),
          blurRadius: 0,
        ),
      ],
    );
  }
}
```
