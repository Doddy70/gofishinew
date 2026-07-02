import { getKaptenReservations } from "@/server-actions/getKaptenReservations";
import EmptyListings from "@/components/ui/EmptyListings";
import ReservationClient from "./ReservationClient";

export default async function KaptenReservationsPage() {
  const reservations = await getKaptenReservations();

  if (reservations.length === 0) {
    return (
      <EmptyListings
        title="Belum ada pesanan"
        subtitle="Anda belum menerima pesanan perahu apa pun."
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pesanan Masuk</h1>
        <p className="text-gray-500">Kelola permintaan sewa perahu dari tamu Anda.</p>
      </div>
      
      <ReservationClient reservations={reservations as any} />
    </div>
  );
}
