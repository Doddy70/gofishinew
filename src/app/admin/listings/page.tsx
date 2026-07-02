import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { redirect } from "next/navigation";
import ListingCard from "@/components/listings/ListingCard";
import EmptyListings from "@/components/ui/EmptyListings";

export default async function AdminListingsPage() {
  const currentUser = await getCurrentUser();

  // Basic security - can be tightened
  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/");
  }

  const listings = await prisma.listing.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (listings.length === 0) {
    return (
      <EmptyListings
        title="Tidak ada perahu"
        subtitle="Sistem belum memiliki data perahu apa pun."
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 py-10">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kelola Semua Perahu</h1>
        <p className="text-gray-500">Admin Mode: Edit atau Hapus perahu mana pun di sistem.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing: any) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            currentUser={currentUser}
            property // Enable edit/delete buttons
          />
        ))}
      </div>
    </div>
  );
}
