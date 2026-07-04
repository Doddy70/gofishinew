import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center">
      <div className="max-w-md">
        <h2 className="text-4xl font-bold text-ink mb-4">404</h2>
        <h3 className="text-xl font-bold text-ink mb-4">
          Perahu Tidak Ditemukan
        </h3>
        <p className="text-muted mb-6">
          Maaf, perahu yang Anda cari tidak ada atau sudah tidak tersedia.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
