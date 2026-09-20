// lib/core/network/api_client.dart

import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Centralized API client with Dio, targeting unified FastAPI backend.
class ApiClient {
  late final Dio client;
  late final Dio nestClient; // Alias for backward compatibility
  late final Dio aiClient;   // Alias for backward compatibility
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;

  ApiClient._internal() {
    // Single unified FastAPI backend URL (default port 8000)
    final baseUrl = dotenv.env['API_BASE_URL'] ?? 'http://10.0.2.2:8000';

    client = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 30),
      headers: {'Content-Type': 'application/json'},
    ));

    // Aliases point to the same unified client
    nestClient = client;
    aiClient = client;

    // Add auth interceptor
    client.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.read(key: 'access_token');
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            // Token expired — clear storage, redirect to login
            await _storage.delete(key: 'access_token');
            // Navigation will be handled by the auth state listener
          }
          return handler.next(error);
        },
      ),
    );
  }

  /// Store auth tokens securely
  Future<void> saveToken(String token) async {
    await _storage.write(key: 'access_token', value: token);
  }

  /// Read auth token
  Future<String?> getToken() async {
    return await _storage.read(key: 'access_token');
  }

  /// Clear auth tokens (logout)
  Future<void> clearToken() async {
    await _storage.delete(key: 'access_token');
  }
}
