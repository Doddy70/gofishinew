"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LuMapPin,
  LuAnchor,
  LuStar,
  LuChevronLeft,
  LuChevronRight,
  LuUsers,
  LuSearch,
  LuSettings2,
  LuCalendar,
  LuArrowRight,
} from "react-icons/lu";
import { format } from "date-fns";
import HeartButton from "@/components/favorites/HeartButton";

interface Trip {
  id: string;
  dateStart: string;
  dateEnd: string;
  priceTotal: number;
  seatsAvailable: number;
  maxSeats: number;
}

interface Listing {
  id: string;
  title: string;
  slug: string | null;
  imageSrc: string;
  images: string[];
  boatType: string;
  passengerCapacity: number;
  price: number;
  engine1: string | null;
  engine2: string | null;
  facilities: string[];
  rating: number;
  reviewCount: number;
  favoriteCount: number;
  captain: { id: string; name: string; image: string | null };
  availableTrips: Trip[];
}

interface Location {
  id: string;
  name: string;
  region: string;
  image: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface Filters {
  minPrice?: number;
  maxPrice?: number;
  boatType?: string;
  passengerCapacity?: number;
}

interface LocationDetailClientProps {
  location: Location;
  initialListings: Listing[];
  initialPagination: Pagination;
  filters: Filters;
}

// Filter categories
const BOAT_TYPES = ["Semua", "Center Console", "Walkaround", "Catamaran", "Sport Fisher"];
const CAPACITY_OPTIONS = ["Semua", "1-3", "4-6", "7+"];

export default function LocationDetailClient({
  location,
  initialListings,
  initialPagination,
  filters,
}: LocationDetailClientProps) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBoatType, setSelectedBoatType] = useState(filters.boatType || "");
  const [selectedCapacity, setSelectedCapacity] = useState(
    filters.passengerCapacity
      ? filters.passengerCapacity >= 7
        ? "7+"
        : `${filters.passengerCapacity}-${filters.passengerCapacity + 2}`
      : ""
  );
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() || "");
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() || "");

  const buildUrl = (overrides: Record<string, string | number | undefined> = {}) => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (selectedBoatType && selectedBoatType !== "Semua")
      params.set("boatType", selectedBoatType);
    if (selectedCapacity && selectedCapacity !== "Semua") {
      const [min] = selectedCapacity.split("-").map(Number);
      if (min) params.set("guests", String(min));
    }
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    Object.entries(overrides).forEach(([k, v]) => {
      if (v !== undefined) params.set(k, String(v));
    });
    return `/locations/${location.id}?${params.toString()}`;
  };

  const applyFilters = () => {
    router.push(buildUrl());
  };

  const clearFilters = () => {
    setSelectedBoatType("");
    setSelectedCapacity("");
    setMinPrice("");
    setMaxPrice("");
    router.push(`/locations/${location.id}`);
  };

  const hasFilters =
    selectedBoatType || selectedCapacity || minPrice || maxPrice;

  const handlePageChange = (newPage: number) => {
    router.push(buildUrl({ page: newPage }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ─────────────────────────────────────────────
          STICKY SEARCH BAR - AIRBNB STYLE
      ───────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <Link
              href="/locations"
              className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <LuChevronLeft className="w-5 h-5 text-gray-600" />
            </Link>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
              <Link
                href="/"
                className="text-[#717171] hover:text-[#222222] transition-colors"
              >
                Beranda
              </Link>
              <LuArrowRight className="w-3 h-3 text-gray-400" />
              <Link
                href="/locations"
                className="text-[#717171] hover:text-[#222222] transition-colors"
              >
                Lokasi
              </Link>
              <LuArrowRight className="w-3 h-3 text-gray-400" />
              <span className="font-semibold text-[#222222] truncate">
                {location.name}
              </span>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors flex-shrink-0 ${
                hasFilters
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 text-gray-700 hover:border-gray-900"
              }`}
            >
              <LuSettings2 className="w-4 h-4" />
              Filter
              {hasFilters && (
                <span className="w-5 h-5 bg-[#FF385C] text-white text-[10px] rounded-full flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-wrap items-end gap-4">
                {/* Boat Type */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Tipe Perahu
                  </label>
                  <select
                    value={selectedBoatType}
                    onChange={(e) => setSelectedBoatType(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:border-gray-900 focus:outline-none"
                  >
                    {BOAT_TYPES.map((t) => (
                      <option key={t} value={t === "Semua" ? "" : t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Kapasitas Tamu
                  </label>
                  <select
                    value={selectedCapacity}
                    onChange={(e) => setSelectedCapacity(e.target.value)}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:border-gray-900 focus:outline-none"
                  >
                    {CAPACITY_OPTIONS.map((c) => (
                      <option key={c} value={c === "Semua" ? "" : c}>
                        {c === "Semua" ? "Semua" : `${c} orang`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Harga / Hari
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="Min"
                      className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none"
                    />
                    <span className="text-gray-400">—</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="Max"
                      className="w-24 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Reset
                    </button>
                  )}
                  <button
                    onClick={applyFilters}
                    className="px-5 py-2.5 bg-[#FF385C] text-white text-sm font-semibold rounded-lg hover:bg-[#E31C5F] transition-colors"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────
          LOCATION HERO
      ───────────────────────────────────────────── */}
      <div className="bg-[#F7F7F7] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Location Header */}
          <div className="flex items-start gap-5">
            {/* Location Image */}
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0 hidden sm:block">
              {location.image ? (
                <Image
                  src={location.image}
                  alt={location.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-50">
                  <LuAnchor className="w-10 h-10 text-blue-200" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#222222] mb-1">
                {location.name}
              </h1>
              <p className="text-[#717171] flex items-center gap-1.5 text-sm mb-3">
                <LuMapPin className="w-4 h-4" />
                {location.region}
              </p>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1.5">
                  <LuAnchor className="w-4 h-4 text-[#717171]" />
                  <span className="text-[#717171]">
                    <span className="font-semibold text-[#222222]">
                      {initialPagination.total}
                    </span>{" "}
                    perahu
                  </span>
                </div>
                {initialListings.some((l) => l.rating > 0) && (
                  <div className="flex items-center gap-1.5">
                    <LuStar className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-[#717171]">
                      <span className="font-semibold text-[#222222]">
                        {(
                          initialListings.reduce((s, l) => s + l.rating, 0) /
                          initialListings.filter((l) => l.rating > 0).length
                        ).toFixed(1)}
                      </span>{" "}
                      rating rata-rata
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          BOAT LISTINGS GRID - AIRBNB STYLE
      ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#222222]">
            Perahu di {location.name}
          </h2>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-[#FF385C] hover:underline"
            >
              Hapus filter
            </button>
          )}
        </div>

        {initialListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <LuAnchor className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-[#222222] mb-2">
              Tidak ada perahu ditemukan
            </h3>
            <p className="text-[#717171] mb-6 max-w-sm">
              Coba ubah filter atau lihat lokasi lain
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-[#FF385C] text-white rounded-full font-semibold hover:bg-[#E31C5F] transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <>
            {/* Airbnb-style grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {initialListings.map((listing) => (
                <BoatListingCard key={listing.id} listing={listing} />
              ))}
            </div>

            {/* Pagination - Airbnb style */}
            {initialPagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => handlePageChange(initialPagination.page - 1)}
                  disabled={initialPagination.page === 1}
                  className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full text-sm font-medium disabled:opacity-30 hover:bg-gray-50 transition-colors"
                >
                  <LuChevronLeft className="w-4 h-4" />
                </button>

                {Array.from(
                  { length: Math.min(initialPagination.totalPages, 5) },
                  (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                          initialPagination.page === page
                            ? "bg-gray-900 text-white"
                            : "border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                )}

                <button
                  onClick={() => handlePageChange(initialPagination.page + 1)}
                  disabled={!initialPagination.hasMore}
                  className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full text-sm font-medium disabled:opacity-30 hover:bg-gray-50 transition-colors"
                >
                  <LuChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// AIRBNB-STYLE BOAT LISTING CARD
// ─────────────────────────────────────────────
function BoatListingCard({ listing }: { listing: Listing }) {
  const [imgError, setImgError] = useState(false);
  const detailUrl = listing.slug ? `/perahu/${listing.slug}` : `/listings/${listing.id}`;

  return (
    <Link href={detailUrl} className="group block">
      {/* Image Container */}
      <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-gray-100 mb-3">
        <Image
          src={!imgError ? listing.imageSrc : ""}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
        />

        {/* Favorite Button */}
        <div className="absolute top-3 right-3" onClick={(e) => e.preventDefault()}>
          <HeartButton listingId={listing.id} />
        </div>

        {/* Rating Badge */}
        {listing.rating > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
            <LuStar className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-[#222222]">
              {listing.rating}
            </span>
            <span className="text-xs text-[#717171]">
              ({listing.reviewCount})
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="px-0.5">
        {/* Boat Type + Capacity */}
        <div className="flex items-center gap-1 text-[12px] text-[#717171] mb-0.5">
          <LuAnchor className="w-3 h-3" />
          <span>{listing.boatType}</span>
          <span>•</span>
          <LuUsers className="w-3 h-3" />
          <span>{listing.passengerCapacity} tamu</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[15px] text-[#222222] group-hover:text-[#FF385C] transition-colors line-clamp-1 mb-1">
          {listing.title}
        </h3>

        {/* Captain */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            {listing.captain.image ? (
              <Image
                src={listing.captain.image}
                alt={listing.captain.name}
                width={20}
                height={20}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-gray-500">
                {listing.captain.name.charAt(0)}
              </div>
            )}
          </div>
          <span className="text-[12px] text-[#717171]">
            Kapten {listing.captain.name}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-[15px] font-semibold text-[#222222]">
            Rp {listing.price.toLocaleString("id-ID")}
          </span>
          <span className="text-[13px] text-[#717171]">/ hari</span>
        </div>

        {/* Available Trips */}
        {listing.availableTrips.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {listing.availableTrips.slice(0, 2).map((trip) => (
              <div
                key={trip.id}
                className="flex items-center gap-1 px-2 py-0.5 bg-[#E8F5E9] text-[#2E7D32] rounded text-[10px] font-medium"
              >
                <LuCalendar className="w-2.5 h-2.5" />
                {format(new Date(trip.dateStart), "d MMM")}
              </div>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
