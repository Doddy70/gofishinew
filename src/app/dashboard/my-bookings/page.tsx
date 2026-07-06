import MyBookingsClient from "@/components/dashboard/MyBookingsClient";

export default function MyBookingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Perjalanan Saya</h1>
        <p className="text-gray-500 mt-2">Lihat histori penyewaan perahu dan status perjalanan Anda.</p>
      </div>
      <MyBookingsClient />
    </div>
  );
}
