// @ts-nocheck
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { getRservations } from "@/server-actions/getReservations";
import EmptyListings from "../ui/EmptyListings";
import ListingCard from "../listings/ListingCard";

export default async function ReservationPage() {
  const reservations = await getRservations();
  const currentUser = await getCurrentUser();

  if (reservations.length === 0) {
    return (
      <EmptyListings
        title="Reservasi tidak ditemukan"
        subtitle="Sepertinya perahu Anda belum ada yang memesan."
      />
    );
  }
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">Reservasi Masuk</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {reservations.map((resrvation) => {
          return (
            <ListingCard
              listing={resrvation.listing}
              key={resrvation.id}
              currentUser={currentUser}
              reservation={{
                id: resrvation.id,
                startDate: resrvation.startDate,
                endDate: resrvation.endDate,
                totalPrice: resrvation.totalPrice,
              }}
              trip
              actionLabel="Batalkan reservasi"
            />
          );
        })}
      </div>
    </div>
  );
}
