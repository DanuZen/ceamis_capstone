import React from 'react';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <h1 className="text-4xl font-bold mb-4">CEAMIS: Revolusi Fintech Gen Z</h1>
      <p className="mb-6 text-lg max-w-xl text-center">Selamat datang di CEAMIS! Platform keuangan dengan gaya sarkas, edukasi adaptif, dan keamanan transparan. Siap jadi bagian dari revolusi finansial?</p>
      <a href="/auth" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Mulai Sekarang
      </a>
    </main>
  );
}
