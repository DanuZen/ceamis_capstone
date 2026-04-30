// Halaman Auth (Login/Register/Guest Mode)
export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Masuk ke CEAMIS</h1>
      <button className="bg-blue-600 text-white px-4 py-2 rounded mb-2">Login</button>
      <button className="bg-green-600 text-white px-4 py-2 rounded mb-2">Register</button>
      <button className="bg-gray-400 text-white px-4 py-2 rounded">Lanjut sebagai Guest</button>
    </div>
  );
}
