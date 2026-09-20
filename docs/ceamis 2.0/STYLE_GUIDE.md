# Design System & Style Guide — CEAMIS 2.0 (Neo-Brutalism)

**Filosofi Desain:** *Neo-Brutalism for Gen-Z*  
**Karakter Visual:** Tegas (*Hard Borders*), Kontras Tinggi (*High Contrast*), Bayangan Solid Tanpa Blur (*Hard Drop Shadows*), Berani & Menyenangkan (*Playful & Bold*), serta Fungsional Tanpa Basa-basi (*Raw & Purposeful*).  
**Cakupan Implementasi:**
1. **Flutter Mobile App** (Aplikasi Pengguna Utama — interaktif, taktil, dinamis)
2. **Next.js Web App** (Portal Admin & Model Governance — tegas, terstruktur, analitis)

---

## 1. Prinsip Utama Desain

1. **Hard Borders (Batas Garis Tebal):**
   Setiap kartu, tombol, kontainer input, dan dialog wajib memiliki garis tepi (*stroke/border*) hitam pekat (`#0F172A` atau `#000000`) dengan ketebalan **2.0px hingga 3.0px**.
2. **Hard Drop Shadows (Zero Gaussian Blur):**
   Tidak diperbolehkan menggunakan bayangan halus atau *blurred drop shadow*. Semua bayangan berupa blok warna solid offset **3px s.d. 5px** ke arah kanan-bawah (`Offset(4.0, 4.0)`).
3. **Vibrant Accent Palette:**
   Menggunakan palet warna pop-art bernuansa elektrik untuk menarik perhatian generasi Z: *Electric Lime*, *Cyber Yellow*, *Coral Red*, dan *Neon Sky*, yang dipadukan dengan latar belakang netral yang bersih (*Off-White / Alabaster*).
4. **Tactile Micro-Interactions (Click Offset):**
   Saat tombol atau kartu ditekan (*pressed/active*), elemen visual bergeser `2px` ke kanan-bawah bersamaan dengan reduksi bayangan menjadi `2px`. Ini menciptakan sensasi menekan tombol saklar fisik mekanis.
5. **Clear Risk Hierarchy:**
   Status risiko pra-pembelian memiliki visualisasi yang sangat kontras dan langsung terbaca dalam 1 detik:
   - **Risiko Rendah:** Hijau *Electric Lime*
   - **Risiko Sedang:** Kuning *Cyber Yellow*
   - **Risiko Tinggi:** Merah *Coral Red* pekat dengan ikon peringatan tegas

---

## 2. Palet Warna (Color Palette & Design Tokens)

### 2.1 Warna Netral & Fondasi
| Token | Hex Code | Nama Visual | Peran Penggunaan |
|---|---|---|---|
| `--color-dark` | `#0F172A` | Jet Black / Deep Slate | Border semua komponen, teks utama, bayangan solid |
| `--color-bg` | `#F8FAFC` | Alabaster Slate | Latar belakang (*background*) halaman utama |
| `--color-surface` | `#FFFFFF` | Pure White | Latar belakang kartu, form input, modal |
| `--color-muted` | `#64748B` | Slate Gray | Label sekunder, teks placeholder, meta-info |

### 2.2 Warna Aksen Elektrik
| Token | Hex Code | Nama Visual | Peran Penggunaan |
|---|---|---|---|
| `--color-lime` | `#A3E635` | Electric Lime | Tombol CTA utama, badge risiko rendah, target tabungan |
| `--color-yellow` | `#FACC15` | Cyber Yellow | Peringatan pra-pembelian sedang, highlight tips |
| `--color-cyan` | `#38BDF8` | Neon Sky | Kategori kebutuhan pokok (*Needs*), filter transaksi |
| `--color-purple` | `#C084FC` | Vivid Purple | Kategori hiburan/keinginan (*Wants*), edukasi modul |

### 2.3 Warna Status & Evaluasi Risiko (Semantik)
| Status | Token | Hex Code | Makna pada Pra-Pembelian / Health Score |
|---|---|---|---|
| **Aman / Sehat** | `--status-safe` | `#22C55E` / `#A3E635` | Risiko Rendah, Health Score: *Sehat* (≥ 75), Pemasukan |
| **Waspada / Sedang** | `--status-warn` | `#F59E0B` / `#FACC15` | Risiko Sedang, Health Score: *Waspada* (50–74), Batas 80% Pagu |
| **Bahaya / Tinggi** | `--status-danger` | `#EF4444` | Risiko Tinggi (Impulsif), Health Score: *Boros* (< 50), Overbudget |

---

## 3. Tipografi (Typography)

* **Font UI & Body:** `Plus Jakarta Sans` (keterbacaan tinggi pada layar mobile).
* **Font Display & Heading:** `Space Grotesk` atau `Outfit` (geometris, modern, tegas).

| Tingkat Tipografi | Ukuran | Weight | Line Height | Penggunaan |
|---|---|---|---|---|
| **Display Large** | 36px – 44px | 900 (Black) | 1.1 | Skor Kesehatan Finansial, Total Saldo |
| **Heading 1** | 28px – 32px | 800 (ExtraBold) | 1.2 | Judul Layar Utama (Dashboard, Pra-Pembelian) |
| **Heading 2** | 20px – 24px | 800 (ExtraBold) | 1.3 | Judul Bagian, Nama Kategori, Label Card |
| **Heading 3** | 16px – 18px | 700 (Bold) | 1.4 | Label Form Input, Judul Modal Peringatan |
| **Body Large** | 15px – 16px | 600 (SemiBold) | 1.5 | Teks Rekomendasi Alasan Risiko AI |
| **Body Medium** | 13px – 14px | 500 (Medium) | 1.5 | Paragraf penjelasan, item transaksi |
| **Caption** | 11px – 12px | 700 (Bold) | 1.4 | Tag Kategori, Tanggal, Timestamp Audit |

---

## 4. Komponen Khas Neo-Brutalism

### 4.1 Tombol Aksi (Brutal Button)
* **Border:** `2.5px solid #0F172A`
* **Border Radius:** `10px` (*soft-brutalism*)
* **Shadow Default:** `4px 4px 0px #0F172A`
* **Shadow Pressed:** `1px 1px 0px #0F172A` dengan translasi `Offset(3px, 3px)`

### 4.2 Kartu Konten (Brutal Card)
* **Border:** `2.0px solid #0F172A`
* **Border Radius:** `12px`
* **Background:** `#FFFFFF` (atau warna aksen untuk kartu sorotan)
* **Shadow:** `4px 4px 0px #0F172A`

### 4.3 Kartu Hasil Peringatan Pra-Pembelian (Pre-Purchase Risk Card)
Komponen visual paling penting di CEAMIS 2.0:
* **Header Risiko:**
  - Badge tebal dengan latar warna semantik:
    - `[ ⚠️ RISIKO TINGGI (78%) ]` (Latar `#EF4444`, teks putih/hitam tebal)
    - `[ ⚡ RISIKO SEDANG (52%) ]` (Latar `#FACC15`, teks hitam tebal)
    - `[ ✅ RISIKO RENDAH (18%) ]` (Latar `#A3E635`, teks hitam tebal)
* **Faktor Pemicu (Explainable Factors):**
  - Kotak berlatar `#F8FAFC` dengan border `1.5px` berisi poin-poin alasan:
    - 🔴 *"Nominal ini 2.4x lebih besar dari rata-rata pengeluaran Shopping Anda."*
    - 🔴 *"Sisa anggaran Shopping bulan ini tinggal 15% (Rp 95.000)."*
* **Bar Simulasi Dampak Anggaran (Budget Impact Bar):**
  - Menampilkan sisa anggaran sebelum vs sesudah rencana belanja:
    - Sebelum: `Rp 400.000` (40% pagu)
    - Setelah belanja: `Rp 150.000` (15% pagu)
* **Dampak ke Target Tabungan:**
  - Badge indikator: *"Target Tabungan Laptop tertunda +5 hari."*
* **Tombol Aksi Tiga Cabang:**
  1. `[ Lanjut Beli ]` (Tombol outline sekunder)
  2. `[ Sesuaikan Nominal ]` (Tombol aksen kuning)
  3. `[ Tunda Pembelian ]` (Tombol primer hijau/lime tebal dengan shadow 4px)

---

## 5. Panduan Implementasi di Flutter Mobile

### 5.1 Helper Neo-Brutalist Box Decoration (`mobile/lib/core/theme/`)

```dart
import 'package:flutter/material.dart';

class NeoBrutalDecoration {
  static BoxDecoration box({
    Color backgroundColor = Colors.white,
    Color borderColor = const Color(0xFF0F172A),
    Color shadowColor = const Color(0xFF0F172A),
    double borderWidth = 2.5,
    double borderRadius = 12.0,
    double shadowOffset = 4.0,
  }) {
    return BoxDecoration(
      color: backgroundColor,
      borderRadius: BorderRadius.circular(borderRadius),
      border: Border.all(color: borderColor, width: borderWidth),
      boxShadow: [
        BoxShadow(
          color: shadowColor,
          offset: Offset(shadowOffset, shadowOffset),
          blurRadius: 0, // Hard shadow!
        ),
      ],
    );
  }
}
```

### 5.2 Widget Tombol Neo-Brutal Taktil (`NeoBrutalButton`)

```dart
class NeoBrutalButton extends StatefulWidget {
  final VoidCallback onPressed;
  final Widget child;
  final Color color;
  final double height;

  const NeoBrutalButton({
    super.key,
    required this.onPressed,
    required this.child,
    this.color = const Color(0xFFA3E635),
    this.height = 52.0,
  });

  @override
  State<NeoBrutalButton> createState() => _NeoBrutalButtonState();
}

class _NeoBrutalButtonState extends State<NeoBrutalButton> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) {
        setState(() => _isPressed = false);
        widget.onPressed();
      },
      onTapCancel: () => setState(() => _isPressed = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 70),
        height: widget.height,
        transform: Matrix4.translationValues(
          _isPressed ? 3.0 : 0.0,
          _isPressed ? 3.0 : 0.0,
          0.0,
        ),
        decoration: NeoBrutalDecoration.box(
          backgroundColor: widget.color,
          shadowOffset: _isPressed ? 1.0 : 4.0,
        ),
        alignment: Alignment.center,
        child: widget.child,
      ),
    );
  }
}
```

---

## 6. Panduan Implementasi di Next.js Web (Admin Portal)

Portal Admin menggunakan kombinasi Tailwind CSS dengan utility class khusus Neo-Brutalism:

```javascript
// tailwind.config.js snippet
module.exports = {
  theme: {
    extend: {
      colors: {
        'brutal-dark': '#0F172A',
        'brutal-bg': '#F8FAFC',
        'brutal-lime': '#A3E635',
        'brutal-yellow': '#FACC15',
        'brutal-danger': '#EF4444',
      },
      boxShadow: {
        'brutal': '4px 4px 0px #0F172A',
        'brutal-sm': '2px 2px 0px #0F172A',
        'brutal-lg': '6px 6px 0px #0F172A',
      },
      borderWidth: {
        '3': '3px',
      }
    }
  }
}
```

Tabel data dan kartu metrik admin wajib mempertahankan border solid `2px` dan shadow `4px 4px 0px #0F172A` untuk keselarasan identitas visual ekosistem CEAMIS 2.0.
