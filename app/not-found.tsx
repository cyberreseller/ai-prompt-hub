import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] flex items-center justify-center px-4">
      <div className="double-bezel max-w-md w-full text-center">
        <div className="double-bezel-inner p-8 sm:p-10">
          <p className="font-mono text-xs text-indigo-400 tracking-widest">404</p>
          <h1 className="mt-2 text-2xl font-bold text-white tracking-tight">
            Сторінку не знайдено
          </h1>
          <p className="mt-2 text-sm text-[#8f9ba8] leading-relaxed">
            Схоже, цей промпт втік в інший вимір. Поверніться до каталогу та продовжіть дослідження.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/25 active:scale-[0.98]"
          >
            На головну
          </Link>
        </div>
      </div>
    </main>
  );
}
