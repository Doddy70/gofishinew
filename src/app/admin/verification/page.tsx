import { getPendingVerifications } from "@/server-actions/getPendingVerifications";
import VerificationClient from "./VerificationClient";

export default async function AdminVerificationPage() {
  const pendingUsers = await getPendingVerifications();

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Verifikasi & Onboarding Kapten</h1>
        <p className="text-gray-500">Tinjau dokumen legalitas (Lisensi, Sertifikat) sebelum memberikan akses berjualan.</p>
      </div>
      
      <VerificationClient initialUsers={pendingUsers as any} />
    </div>
  );
}
