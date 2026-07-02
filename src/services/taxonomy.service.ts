import prisma from "@/lib/prisma";

export class TaxonomyService {
  // Category Methods
  static async getCategories() {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  }

  static async createCategory(name: string, image?: string) {
    return await prisma.category.create({
      data: { name, image }
    });
  }

  // Location Methods
  static async getLocations() {
    return await prisma.location.findMany({
      orderBy: { region: 'asc' }
    });
  }

  static async createLocation(name: string, region: string, image?: string) {
    return await prisma.location.create({
      data: { name, region, image }
    });
  }

  // Amenity Methods
  static async getAmenities() {
    return await prisma.amenity.findMany({
      orderBy: { name: 'asc' }
    });
  }

  static async createAmenity(name: string, icon?: string) {
    return await prisma.amenity.create({
      data: { name, icon }
    });
  }
}
