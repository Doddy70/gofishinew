import { listingRepository, ListingFilterParams } from "@/repositories/ListingRepository";

export type GetListingsParams = ListingFilterParams;

export async function getListings(params?: GetListingsParams) {
  try {
    return await listingRepository.getAllListings(params);
  } catch (error: any) {
    console.error("[getListings Service] Error fetching listings:", error.message);
    throw new Error("Failed to fetch listings");
  }
}
