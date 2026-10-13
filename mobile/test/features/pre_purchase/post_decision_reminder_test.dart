// test/features/pre_purchase/post_decision_reminder_test.dart

import 'package:flutter_test/flutter_test.dart';
import 'package:ceamis_mobile/features/pre_purchase/services/post_decision_reminder_service.dart';

void main() {
  setUp(() {
    PostDecisionReminderService.inMemoryOverride = [];
  });

  tearDown(() {
    PostDecisionReminderService.inMemoryOverride = null;
  });

  group('PostDecisionReminderService - Window Logic', () {
    final baseTime = DateTime(2026, 10, 1, 10, 0, 0);

    test('Waktu < 24 jam belum memicu pengingat', () {
      final decidedAt = baseTime;
      final checkTime = baseTime.add(const Duration(hours: 12));

      expect(
        PostDecisionReminderService.isWithinReminderWindow(decidedAt, now: checkTime),
        isFalse,
      );
    });

    test('Tepat 24 jam memicu pengingat', () {
      final decidedAt = baseTime;
      final checkTime = baseTime.add(const Duration(hours: 24));

      expect(
        PostDecisionReminderService.isWithinReminderWindow(decidedAt, now: checkTime),
        isTrue,
      );
    });

    test('Di antara 24 jam dan 72 jam memicu pengingat', () {
      final decidedAt = baseTime;
      final checkTime = baseTime.add(const Duration(hours: 48));

      expect(
        PostDecisionReminderService.isWithinReminderWindow(decidedAt, now: checkTime),
        isTrue,
      );
    });

    test('Tepat 72 jam memicu pengingat', () {
      final decidedAt = baseTime;
      final checkTime = baseTime.add(const Duration(hours: 72));

      expect(
        PostDecisionReminderService.isWithinReminderWindow(decidedAt, now: checkTime),
        isTrue,
      );
    });

    test('Lebih dari 72 jam tidak lagi memicu pengingat (jendela kedaluwarsa)', () {
      final decidedAt = baseTime;
      final checkTime = baseTime.add(const Duration(hours: 72, minutes: 1));

      expect(
        PostDecisionReminderService.isWithinReminderWindow(decidedAt, now: checkTime),
        isFalse,
      );
    });
  });

  group('PostDecisionReminderService - Workflow State', () {
    final baseTime = DateTime(2026, 10, 1, 10, 0, 0);

    test('Perekaman keputusan PROCEED dan retrieval reminder sesuai jendela', () async {
      await PostDecisionReminderService.recordDecision(
        checkId: 'check-001',
        itemName: 'Sepatu Lari',
        amount: 450000,
        categoryName: 'Pakaian',
        decision: 'PROCEED',
        decidedAt: baseTime,
      );

      // Pada jam ke-10: Belum aktif
      final reminderBefore = await PostDecisionReminderService.getActiveReminder(
        now: baseTime.add(const Duration(hours: 10)),
      );
      expect(reminderBefore, isNull);

      // Pada jam ke-30: Aktif
      final reminderActive = await PostDecisionReminderService.getActiveReminder(
        now: baseTime.add(const Duration(hours: 30)),
      );
      expect(reminderActive, isNotNull);
      expect(reminderActive!.checkId, equals('check-001'));
      expect(reminderActive.itemName, equals('Sepatu Lari'));
      expect(reminderActive.amount, equals(450000));
    });

    test('Pengguna mengabaikan banner (dismiss) menyembunyikan pengingat tanpa error', () async {
      await PostDecisionReminderService.recordDecision(
        checkId: 'check-002',
        itemName: 'Kopi Kekinian',
        amount: 35000,
        categoryName: 'Makanan',
        decision: 'ADJUST',
        decidedAt: baseTime,
      );

      final reminderActive = await PostDecisionReminderService.getActiveReminder(
        now: baseTime.add(const Duration(hours: 25)),
      );
      expect(reminderActive, isNotNull);

      // Dismiss oleh user
      await PostDecisionReminderService.dismissReminder('check-002');

      // Setelah dismiss, getActiveReminder harus null
      final reminderAfterDismiss = await PostDecisionReminderService.getActiveReminder(
        now: baseTime.add(const Duration(hours: 25)),
      );
      expect(reminderAfterDismiss, isNull);
    });

    test('Pengguna menyelesaikan konfirmasi (submitted) menyembunyikan pengingat', () async {
      await PostDecisionReminderService.recordDecision(
        checkId: 'check-003',
        itemName: 'Gadget Baru',
        amount: 1200000,
        categoryName: 'Elektronik',
        decision: 'PROCEED',
        decidedAt: baseTime,
      );

      // Mark submitted
      await PostDecisionReminderService.markSubmitted('check-003');

      final reminderAfterSubmit = await PostDecisionReminderService.getActiveReminder(
        now: baseTime.add(const Duration(hours: 30)),
      );
      expect(reminderAfterSubmit, isNull);
    });

    test('Dua item: hanya item yang memenuhi kriteria jendela yang diambil', () async {
      // Item 1: diputuskan 5 jam lalu (< 24 jam)
      await PostDecisionReminderService.recordDecision(
        checkId: 'check-recent',
        itemName: 'Item Baru',
        amount: 50000,
        categoryName: 'Hobi',
        decision: 'PROCEED',
        decidedAt: baseTime.subtract(const Duration(hours: 5)),
      );

      // Item 2: diputuskan 30 jam lalu (24 - 72 jam)
      await PostDecisionReminderService.recordDecision(
        checkId: 'check-eligible',
        itemName: 'Item Siap Konfirmasi',
        amount: 150000,
        categoryName: 'Kebutuhan',
        decision: 'ADJUST',
        decidedAt: baseTime.subtract(const Duration(hours: 30)),
      );

      final active = await PostDecisionReminderService.getActiveReminder(now: baseTime);
      expect(active, isNotNull);
      expect(active!.checkId, equals('check-eligible'));
    });
  });
}
