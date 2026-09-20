// lib/core/constants/app_colors.dart

import 'package:flutter/material.dart';

/// CEAMIS Design System — Color Palette
/// Premium dark theme with vibrant accents for Gen-Z audience.
class AppColors {
  AppColors._();

  // ── Primary Brand ──────────────────────────────
  static const Color primary = Color(0xFF6C5CE7);
  static const Color primaryLight = Color(0xFF9B8FFF);
  static const Color primaryDark = Color(0xFF4834C7);

  // ── Accent / Secondary ─────────────────────────
  static const Color accent = Color(0xFF00D2FF);
  static const Color accentLight = Color(0xFF7EEAFF);
  static const Color accentDark = Color(0xFF009DC5);

  // ── Semantic — Financial Status ────────────────
  static const Color sehat = Color(0xFF00E676);      // Spending Category: Sehat
  static const Color waspada = Color(0xFFFFAB00);     // Spending Category: Waspada
  static const Color boros = Color(0xFFFF5252);       // Spending Category: Boros

  // ── Semantic — General ─────────────────────────
  static const Color success = Color(0xFF00E676);
  static const Color warning = Color(0xFFFFAB00);
  static const Color error = Color(0xFFFF5252);
  static const Color info = Color(0xFF29B6F6);

  // ── Background & Surface (Dark Mode) ──────────
  static const Color background = Color(0xFF0D0D1A);
  static const Color surface = Color(0xFF1A1A2E);
  static const Color surfaceVariant = Color(0xFF252542);
  static const Color card = Color(0xFF16162A);

  // ── Text ───────────────────────────────────────
  static const Color textPrimary = Color(0xFFF0F0F5);
  static const Color textSecondary = Color(0xFFA0A0B8);
  static const Color textMuted = Color(0xFF6B6B80);

  // ── Borders & Dividers ─────────────────────────
  static const Color border = Color(0xFF2A2A45);
  static const Color divider = Color(0xFF22223A);

  // ── Gradient Presets ───────────────────────────
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, accent],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient cardGradient = LinearGradient(
    colors: [Color(0xFF1E1E38), Color(0xFF16162A)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient scoreGradient = LinearGradient(
    colors: [Color(0xFF6C5CE7), Color(0xFF00D2FF)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );
}
