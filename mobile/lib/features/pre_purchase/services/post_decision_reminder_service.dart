// lib/features/pre_purchase/services/post_decision_reminder_service.dart

import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Model item pengingat konfirmasi pasca-keputusan (Tugas F5)
class PendingFeedbackCheck {
  final String checkId;
  final String itemName;
  final double amount;
  final String categoryName;
  final String decision; // PROCEED / ADJUST
  final DateTime decidedAt;
  final bool dismissed;
  final bool feedbackSubmitted;

  const PendingFeedbackCheck({
    required this.checkId,
    required this.itemName,
    required this.amount,
    required this.categoryName,
    required this.decision,
    required this.decidedAt,
    this.dismissed = false,
    this.feedbackSubmitted = false,
  });

  Map<String, dynamic> toJson() => {
        'check_id': checkId,
        'item_name': itemName,
        'amount': amount,
        'category_name': categoryName,
        'decision': decision,
        'decided_at': decidedAt.toIso8601String(),
        'dismissed': dismissed,
        'feedback_submitted': feedbackSubmitted,
      };

  factory PendingFeedbackCheck.fromJson(Map<String, dynamic> json) =>
      PendingFeedbackCheck(
        checkId: json['check_id'] as String? ?? '',
        itemName: json['item_name'] as String? ?? 'Item Belanja',
        amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
        categoryName: json['category_name'] as String? ?? 'Belanja',
        decision: json['decision'] as String? ?? 'PROCEED',
        decidedAt: DateTime.tryParse(json['decided_at'] as String? ?? '') ??
            DateTime.now(),
        dismissed: json['dismissed'] as bool? ?? false,
        feedbackSubmitted: json['feedback_submitted'] as bool? ?? false,
      );

  PendingFeedbackCheck copyWith({
    bool? dismissed,
    bool? feedbackSubmitted,
  }) =>
      PendingFeedbackCheck(
        checkId: checkId,
        itemName: itemName,
        amount: amount,
        categoryName: categoryName,
        decision: decision,
        decidedAt: decidedAt,
        dismissed: dismissed ?? this.dismissed,
        feedbackSubmitted: feedbackSubmitted ?? this.feedbackSubmitted,
      );
}

/// Layanan pengingat konfirmasi pasca-keputusan (24 jam hingga 72 jam setelah keputusan PROCEED / ADJUST)
class PostDecisionReminderService {
  PostDecisionReminderService._();

  static const String _storageKey = 'pending_feedback_checks_v1';
  static const FlutterSecureStorage _storage = FlutterSecureStorage();

  // In-memory fallback untuk pengujian widget/unit
  @visibleForTesting
  static List<PendingFeedbackCheck>? inMemoryOverride;

  /// Memeriksa apakah suatu waktu keputusan berada dalam jendela pengingat [24 jam, 72 jam]
  static bool isWithinReminderWindow(DateTime decidedAt, {DateTime? now}) {
    final currentTime = now ?? DateTime.now();
    final startWindow = decidedAt.add(const Duration(hours: 24));
    final endWindow = decidedAt.add(const Duration(hours: 72));
    return !currentTime.isBefore(startWindow) && !currentTime.isAfter(endWindow);
  }

  /// Membaca seluruh antrean konfirmasi yang tersimpan
  static Future<List<PendingFeedbackCheck>> getAllPending() async {
    if (inMemoryOverride != null) {
      return List.from(inMemoryOverride!);
    }
    try {
      final raw = await _storage.read(key: _storageKey);
      if (raw == null || raw.isEmpty) return [];
      final list = jsonDecode(raw) as List<dynamic>;
      return list
          .map((e) => PendingFeedbackCheck.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (e) {
      debugPrint('[ReminderService] Read failed: $e');
      return [];
    }
  }

  /// Menyimpan antrean konfirmasi
  static Future<void> _saveAll(List<PendingFeedbackCheck> list) async {
    if (inMemoryOverride != null) {
      inMemoryOverride = List.from(list);
      return;
    }
    try {
      final raw = jsonEncode(list.map((e) => e.toJson()).toList());
      await _storage.write(key: _storageKey, value: raw);
    } catch (e) {
      debugPrint('[ReminderService] Save failed: $e');
    }
  }

  /// Mencatat keputusan baru (PROCEED atau ADJUST) untuk dijadwalkan konfirmasi
  static Future<void> recordDecision({
    required String checkId,
    required String itemName,
    required double amount,
    required String categoryName,
    required String decision,
    DateTime? decidedAt,
  }) async {
    final list = await getAllPending();
    // Hapus duplikat ID jika sudah ada sebelumnya
    list.removeWhere((e) => e.checkId == checkId);
    list.add(PendingFeedbackCheck(
      checkId: checkId,
      itemName: itemName,
      amount: amount,
      categoryName: categoryName,
      decision: decision,
      decidedAt: decidedAt ?? DateTime.now(),
    ));
    await _saveAll(list);
  }

  /// Mengambil satu pemeriksaan yang saat ini aktif dalam jendela 24-72 jam untuk ditampilkan di banner Beranda
  static Future<PendingFeedbackCheck?> getActiveReminder({DateTime? now}) async {
    final list = await getAllPending();
    for (final item in list) {
      // Abaikan jika sudah pernah dikonfirmasi atau diabaikan oleh pengguna
      if (item.dismissed || item.feedbackSubmitted) continue;

      if (isWithinReminderWindow(item.decidedAt, now: now)) {
        return item;
      }
    }
    return null;
  }

  /// Mengabaikan pengingat tanpa error (tanda banner ditutup oleh user)
  static Future<void> dismissReminder(String checkId) async {
    final list = await getAllPending();
    final updated = list.map((item) {
      if (item.checkId == checkId) {
        return item.copyWith(dismissed: true);
      }
      return item;
    }).toList();
    await _saveAll(updated);
  }

  /// Menandai konfirmasi telah berhasil dikirim ke server
  static Future<void> markSubmitted(String checkId) async {
    final list = await getAllPending();
    final updated = list.map((item) {
      if (item.checkId == checkId) {
        return item.copyWith(feedbackSubmitted: true);
      }
      return item;
    }).toList();
    await _saveAll(updated);
  }

  /// Membersihkan seluruh antrean (berguna untuk testing)
  static Future<void> clearAll() async {
    inMemoryOverride = null;
    await _storage.delete(key: _storageKey);
  }
}
