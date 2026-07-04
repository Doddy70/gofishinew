"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Listing page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center">
      <div className="max-w-md">
        <h2 className="text-2xl font-bold text-ink mb-4">
          Terjadi Kesalahan
        </h2>
        <p className="text-muted mb-6">
          Maaf, kami tidak dapat memuat detail perahu ini. Silakan coba lagi
          atau kembali ke halaman utama.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-hairline text-ink font-bold rounded-xl hover:bg-muted transition"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
