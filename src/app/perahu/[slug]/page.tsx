import prisma from "@/lib/prisma";
import ListingPage from "@/components/listings/ListingPage";
import ListingViewSkeleton from "@/components/skeletons/ListingViewSkeleton";
import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate metadata for SEO
 * Supports both slug (e.g., "km-pesona-laut-ancol") and ID (e.g., "cmr5o9al60006hvvdzze1pjwp")
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // Hybrid lookup by slug or ID
  const listing = await prisma.listing.findFirst({
    where: {
      OR: [{ slug }, { id: slug }]
    },
    select: {
      title: true,
      description: true,
      imageSrc: true,
      locationValue: true,
    }
  });

  if (!listing) return { title: "Perahu Tidak Ditemukan" };

  return {
    title: `${listing.title} - Sewa Perahu di ${listing.locationValue}`,
    description: listing.description.substring(0, 160),
    openGraph: {
      title: listing.title,
      description: listing.description.substring(0, 160),
      images: [{ url: listing.imageSrc }],
    },
  };
}

export default async function PerahuDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Hybrid lookup by slug or ID
  const listing = await prisma.listing.findFirst({
    where: {
      OR: [{ slug }, { id: slug }]
    },
    select: { id: true }
  });

  if (!listing) {
    notFound();
  }

  return (
    <Suspense fallback={<ListingViewSkeleton />}>
      <ListingPage listingId={listing.id} />
    </Suspense>
  );
}
