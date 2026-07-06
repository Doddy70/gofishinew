import Breadcrumb from "@/components/navigation/Breadcrumb";
import SearchBarCompact from "@/components/search/SearchBarCompact";
import HorizontalBoatList from "@/components/location/HorizontalBoatList";
import FishingTechniqueChips from "@/components/location/FishingTechniqueChips";
import AmenityFilterChips from "@/components/location/AmenityFilterChips";
import NearbyLocations from "@/components/location/NearbyLocations";
import { BoatListing } from "@/components/location/BoatCardHorizontal";
import { LocationData } from "@/components/location/LocationCard";
import { notFound } from "next/navigation";

// Define the response shape from Claude's API
interface LocationAPIResponse {
  location: {
    id: string;
    name: string;
    slug: string;
    region: string;
    description: string;
    boatCount: number;
    avgPrice: number;
  };
  premiumBoats: BoatListing[];
  popularBoats: BoatListing[];
  fishingTechniques: string[];
  amenities: string[];
  nearbyLocations: LocationData[];
  spots: string[];
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // Fetch real data from the API Claude built
  // Next.js uses absolute URLs for fetches in Server Components, so we construct it.
  // We can just rely on the NEXT_PUBLIC_APP_URL or localhost for dev.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  let data: LocationAPIResponse;
  try {
    const res = await fetch(`${appUrl}/api/locations/${resolvedParams.slug}`, {
      next: { revalidate: 60 } // optional ISR
    });
    
    if (!res.ok) {
      if (res.status === 404) notFound();
      throw new Error(`Failed to fetch location data: ${res.status}`);
    }
    
    data = await res.json();
  } catch (error) {
    console.error("Error fetching location data:", error);
    notFound();
  }
  
  const { 
    location, 
    premiumBoats, 
    popularBoats, 
    fishingTechniques, 
    amenities, 
    nearbyLocations 
  } = data;

  // Format data for NearbyLocations component which expects a grouped structure
  const formattedLocationsData = {
    nearby: nearbyLocations,
    popular: [], // Fill with mock or real data later if needed
    destinations: []
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Search Bar */}
      <SearchBarCompact location={location.name} />
      
      {/* Main Content */}
      <main className="max-w-[2520px] mx-auto pt-4 pb-20">
        
        {/* Breadcrumb */}
        <div className="px-0 md:px-6 xl:px-16">
          <Breadcrumb items={[
            { label: 'Indonesia', href: '/indonesia' },
            { label: location.region, href: `/lokasi?region=${encodeURIComponent(location.region)}` },
            { label: location.name }
          ]} />
        </div>
        
        {/* Hero Header */}
        <div className="px-4 md:px-10 xl:px-20 pt-4 pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Trip Memancing di {location.name}</h1>
          <p className="text-gray-500 mt-2 font-medium">{location.boatCount} kapal tersedia</p>
          {location.description && (
            <p className="text-gray-600 mt-4 max-w-3xl">{location.description}</p>
          )}
        </div>
        
        <div className="px-0 md:px-6 xl:px-16 space-y-6">
          {/* Premium Boats */}
          {premiumBoats && premiumBoats.length > 0 && (
            <HorizontalBoatList 
              title="Kapal Premium" 
              subtitle="Pilihan terbaik dengan rating tertinggi di area ini"
              boats={premiumBoats} 
            />
          )}
          
          {/* Fishing Techniques */}
          {fishingTechniques && fishingTechniques.length > 0 && (
            <section className="px-4 md:px-4 py-6 border-t border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Teknik Memancing Populer</h2>
              <FishingTechniqueChips 
                techniques={fishingTechniques}
              />
            </section>
          )}
          
          {/* Popular Spots */}
          {popularBoats && popularBoats.length > 0 && (
            <HorizontalBoatList 
              title="Spot Populer" 
              subtitle="Kapal yang sering dipesan bulan ini"
              boats={popularBoats} 
            />
          )}
          
          {/* Amenities */}
          {amenities && amenities.length > 0 && (
            <section className="px-4 md:px-4 py-6 border-t border-gray-100">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Fasilitas Kapal</h2>
              <AmenityFilterChips amenities={amenities} />
            </section>
          )}
          
          {/* Nearby Locations */}
          <NearbyLocations 
            currentLocation={location.name} 
            locations={formattedLocationsData} 
          />
        </div>
      </main>
    </div>
  );
}
