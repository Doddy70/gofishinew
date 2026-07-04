'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
        <svg className="text-red-500" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
      </div>
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-gray-900">Aduh, Terjadi Kesalahan!</h2>
        <p className="text-gray-500 w-full max-w-[400px] mx-auto">
          Sistem mengalami kendala teknis saat memuat halaman ini. Jangan khawatir, armada Anda tetap aman.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Kembali ke Beranda
        </Button>
        <Button onClick={() => reset()} className="bg-gray-900">
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
