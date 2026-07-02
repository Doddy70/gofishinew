import { getCurrentUser } from "@/server-actions/getCurrentUser";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-500">Kelola informasi profil dan keamanan akun Anda.</p>
      </div>
      
      <SettingsClient currentUser={currentUser as any} />
    </div>
  );
}
