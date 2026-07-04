// @ts-nocheck
import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { getTrips } from "@/server-actions/getTrips"
import EmptyListings from "../ui/EmptyListings";
import ListingCard from "../listings/ListingCard";


export default async function TripsPage() {
    const trips = await getTrips();
    const currentUser = await getCurrentUser();

    if (trips.length === 0) {
           return (
             <EmptyListings
              title="Trip Saya tidak ditemukan"
              subtitle="Sepertinya Anda belum memesan perjalanan apa pun."
            />
           )
          }
  return (
       <div className="max-w-7xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6">Trip Saya Saya</h2>
      
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {trips.map((trip) => {
                return (
                  <ListingCard
                    listing={trip.listing}                  
                    key={trip.id}
                    currentUser={currentUser}  
                    reservation={{
                        id:trip.id,
                        startDate:trip.startDate,
                        endDate:trip.endDate,
                        totalPrice:trip.totalPrice
                    }}     
                    trip
                    actionLabel="Batalkan Trip Saya"            
                  />
                );
              })}
            </div>
          </div>
    )
}
