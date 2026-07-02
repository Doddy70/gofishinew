import { getCurrentUser } from "@/server-actions/getCurrentUser";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import PackagesClient from "./PackagesClient";

interface IParams {
  listingId?: string;
}

export default async function ListingPackagesPage({ params }: { params: Promise<IParams> }) {
  const { listingId } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return redirect("/");
  }

  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
    include: {
      rentalPackages: true,
    },
  });

  if (!listing || listing.userId !== currentUser.id) {
    return redirect("/dashboard");
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan Paket & Slot Waktu</h1>
        <p className="text-gray-500">Atur durasi trip, waktu keberangkatan, dan harga sewa untuk {listing.title}.</p>
      </div>

      <PackagesClient listing={listing as any} />
    </div>
  );
}
