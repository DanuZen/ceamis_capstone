export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-white">
      <h1 className="text-4xl font-bold mb-4">CEAMIS: Revolusi Fintech Gen Z</h1>
      <p className="mb-6 text-lg max-w-xl text-center">
        Selamat datang di CEAMIS! Platform keuangan dengan gaya sarkas, edukasi adaptif, dan keamanan transparan. Siap jadi bagian dari revolusi finansial?
      </p>
      <a href="/auth" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Mulai Sekarang</a>
    </main>
  );
}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
