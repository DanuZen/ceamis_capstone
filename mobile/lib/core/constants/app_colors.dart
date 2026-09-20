// lib/core/constants/app_colors.dart

import 'package:flutter/material.dart';

/// CEAMIS Design System — Neo-Brutalism Color Palette
/// 100% matched with web dashboard (frontend/src/app/globals.css).
class AppColors {
  AppColors._();

  // ── Core Brand Colors (CEAMIS Neo-Brutalism) ────
  static const Color navy = Color(0xFF0A192F);       // Hard border, shadow, main text
  static const Color purple = Color(0xFF5833EE);     // Primary accent / CTA
  static const Color lime = Color(0xFFB8FF00);       // Success, saving badge, electric highlight
  static const Color orange = Color(0xFFFF5233);     // Danger, overbudget, warning
  static const Color pink = Color(0xFFFF3366);       // Fun accent / wants tag
  static const Color cyan = Color(0xFF00E5FF);       // Secondary accent / needs tag
  static const Color white = Color(0xFFFFFFFF);

  // ── Role Aliases ────────────────────────────────
  static const Color primary = purple;
  static const Color accent = lime;
  static const Color secondary = cyan;

  // ── Status & Spending Category ──────────────────
  static const Color sehat = lime;                   // Spending Category: Sehat
  static const Color waspada = Color(0xFFF59E0B);    // Spending Category: Waspada
  static const Color boros = orange;                 // Spending Category: Boros

  static const Color success = lime;
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = orange;
  static const Color info = cyan;

  // ── Surface & Background (Neo-Brutalism Slate) ──
  static const Color background = Color(0xFFF1F5F9);  // Alabaster slate light background
  static const Color surface = Color(0xFFFFFFFF);     // Pure white card surfaces
  static const Color surfaceVariant = Color(0xFFE2E8F0);
  static const Color card = Color(0xFFFFFFFF);

  // ── Text ─────────────────────────────────────────
  static const Color textPrimary = navy;             // High contrast deep navy
  static const Color textSecondary = Color(0xFF526082);
  static const Color textMuted = Color(0xFF94A3B8);
  static const Color textInverse = white;

  // ── Border & Hard Shadow ─────────────────────────
  static const Color border = navy;
  static const Color shadow = navy;
  static const double borderWidth = 2.5;

  // ── Gradients ────────────────────────────────────
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [purple, cyan],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient limeGradient = LinearGradient(
    colors: [lime, Color(0xFFD4FF55)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient scoreGradient = LinearGradient(
    colors: [purple, lime],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );
}
