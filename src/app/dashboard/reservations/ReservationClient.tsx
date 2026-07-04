"use client";

import EmptyListings from "@/components/ui/EmptyListings";
import { format } from "date-fns";

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  listing: {
    title: string;
    imageSrc: string;
  };
}

export default function ReservationClient({ reservations }: { reservations: Reservation[] }) {
  if (!reservations || reservations.length === 0) {
    return (
      <EmptyListings
        title="Tidak ada reservasi"
        subtitle="Belum ada reservasi untuk armada Anda"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reservations.map((res) => (
        <div key={res.id} className="border rounded-xl p-4 shadow-md">
          <p className="font-semibold">{res.listing.title}</p>
          <p className="text-sm text-gray-500">
            {format(new Date(res.startDate), "dd MMM yyyy")} - {format(new Date(res.endDate), "dd MMM yyyy")}
          </p>
          <p className="font-bold mt-2">Rp {res.totalPrice.toLocaleString("id-ID")}</p>
        </div>
      ))}
    </div>
  );
}
