import { TaxonomyService } from "@/services/taxonomy.service";
import TaxonomyClient from "./TaxonomyClient";

export default async function TaxonomyPage() {
  const categories = await TaxonomyService.getCategories();
  const locations = await TaxonomyService.getLocations();
  const amenities = await TaxonomyService.getAmenities();

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Taksonomi</h1>
        <p className="text-gray-500">Kelola kategori perahu, titik lokasi dermaga, dan fasilitas standar.</p>
      </div>
      
      <TaxonomyClient 
        initialCategories={categories}
        initialLocations={locations}
        initialAmenities={amenities}
      />
    </div>
  );
}
