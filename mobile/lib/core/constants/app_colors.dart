// lib/core/constants/app_colors.dart

import 'package:flutter/material.dart';

/// CEAMIS Design System — Neo-Brutalism Color Palette
/// 100% matched with web dashboard (frontend/src/app/globals.css).
class AppColors {
  AppColors._();

  // ── Danu's Unified 4-Color Palette ──────────────────────
  // hsl(77, 100, 50) -> Electric Lime
  static const Color lime = Color(0xFFB7FF00);

  // hsl(53, 100, 50) -> Solar Yellow
  static const Color yellow = Color(0xFFFFE100);

  // hsl(205, 100, 50) -> Electric Blue
  static const Color blue = Color(0xFF0095FF);

  // hsl(19, 100, 50) -> Neon Coral Orange
  static const Color orange = Color(0xFFFF5100);

  // ── Core Neutrals ────────────────────────────────────────
  static const Color navy = Color(0xFF0A192F);       // Hard border, hard shadow, primary text
  static const Color white = Color(0xFFFFFFFF);      // Card surfaces
  static const Color background = Color(0xFFF1F5F9); // Light background
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFE2E8F0);
  static const Color card = Color(0xFFFFFFFF);

  // ── Semantic Aliases (Strictly 4 HSL Colors) ─────────────
  static const Color primary = lime;
  static const Color accent = blue;
  static const Color secondary = yellow;

  // Status Roles
  static const Color success = lime;                 // Sehat, Credited, Positive
  static const Color warning = yellow;               // Waspada, Caution
  static const Color error = orange;                 // Boros, Debit, Expense, Danger
  static const Color info = blue;                    // Info, Transfer, Analysis

  static const Color sehat = lime;
  static const Color waspada = yellow;
  static const Color boros = orange;

  // Backward compatibility alias
  static const Color purple = blue;
  static const Color cyan = blue;
  static const Color pink = orange;

  // ── Text ─────────────────────────────────────────────────
  static const Color textPrimary = navy;             // High contrast deep navy
  static const Color textSecondary = Color(0xFF526082);
  static const Color textMuted = Color(0xFF94A3B8);
  static const Color textInverse = white;

  // ── Border & Hard Shadow ─────────────────────────────────
  static const Color border = navy;
  static const Color shadow = navy;
  static const double borderWidth = 2.5;

  // ── Gradients ────────────────────────────────────────────
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [blue, lime],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient limeGradient = LinearGradient(
    colors: [lime, yellow],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient scoreGradient = LinearGradient(
    colors: [blue, lime],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );
}
