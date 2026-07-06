"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LuMapPin,
  LuAnchor,
  LuSearch,
  LuChevronLeft,
  LuChevronRight,
  LuUsers,
  LuStar,
  LuCalendar,
  LuSettings2,
} from "react-icons/lu";
import { format } from "date-fns";
import axios from "axios";

interface PreviewBoat {
  id: string;
  title: string;
  image: string;
  price: number;
  slug: string | null;
}

interface Location {
  id: string;
  name: string;
  region: string;
  image: string | null;
  totalBoats: number;
  previewBoats: PreviewBoat[];
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface LocationsPageClientProps {
  initialLocations: Location[];
  initialPagination: Pagination;
  initialSearch?: string;
}

// Category chips like Airbnb
const LOCATION_CATEGORIES = [
  { label: "Semua", value: "" },
  { label: "Dermaga Ancol", value: "ancol" },
  { label: "Muara Angke", value: "muara-angke" },
  { label: "Marina Ancol", value: "marina" },
  { label: "Pantai Mutiara", value: "pantai-mutiara" },
  { label: "Kepulauan Seribu", value: "kepulauan" },
];

export default function LocationsPageClient({
  initialLocations,
  initialPagination,
  initialSearch,
}: LocationsPageClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch || "");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch autocomplete suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(`/api/lokasi/search?q=${search}`);
        setSuggestions(res.data);
      } catch {
        setSuggestions([]);
      }
    };
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    router.push(`/lokasi?${params.toString()}`);
  };

  const handleSuggestionClick = (loc: any) => {
    setSearch(loc.label);
    setShowSuggestions(false);
    router.push(`/lokasi/${loc.value}`);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams();
    if (category) params.set("search", category);
    if (search) params.set("search", search);
    router.push(`/lokasi?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(newPage));
    if (search) params.set("search", search);
    router.push(`/lokasi?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ─────────────────────────────────────────────
          AIRBNB-STYLE SEARCH HERO
      ───────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        {/* Top Search Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mr-2 flex-shrink-0">
              <div className="w-8 h-8 bg-[#FF385C] rounded-lg flex items-center justify-center">
                <LuAnchor className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-[#FF385C] hidden sm:block">
                gofishi
              </span>
            </Link>

            {/* Search Input - Airbnb style */}
            <div className="relative flex-1 max-w-2xl">
              <form onSubmit={handleSearch}>
                <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-1 pl-5 py-3">
                    <label className="block text-[10px] font-bold text-gray-900 uppercase tracking-wide">
                      Lokasi
                    </label>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Cari dermaga, kota..."
                      className="w-full text-sm text-gray-700 outline-none bg-transparent placeholder-gray-400"
                    />
                  </div>
                  <div className="h-8 w-px bg-gray-200" />
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-3 bg-[#FF385C] text-white rounded-full mx-1 hover:bg-[#E31C5F] transition-colors"
                  >
                    <LuSearch className="w-4 h-4" />
                    <span className="font-semibold text-sm hidden sm:inline">
                      Cari
                    </span>
                  </button>
                </div>
              </form>

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden z-50">
                  {suggestions.map((loc) => (
                    <button
                      key={loc.value}
                      onClick={() => handleSuggestionClick(loc)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <LuMapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {loc.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {loc.availableBoats} perahu tersedia
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Chips - Airbnb style horizontal scroll */}
        <div className="border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-hide">
              <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-900 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0">
                <LuSettings2 className="w-3.5 h-3.5" />
                Filter
              </button>
              {LOCATION_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoryClick(cat.value)}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                    selectedCategory === cat.value
                      ? "bg-gray-900 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-gray-900"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          LOCATION INFO BANNER
      ───────────────────────────────────────────── */}
      <div className="bg-[#F7F7F7] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-[#222222]">
                Jelajahi Dermaga
              </h1>
              <p className="text-sm text-[#717171] mt-1">
                {initialPagination.total} dermaga dan pelabuhan tersedia
              </p>
            </div>
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  router.push("/lokasi");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-full text-xs font-medium hover:border-gray-900 transition-colors"
              >
                {search}
                <span className="w-4 h-4 flex items-center justify-center bg-gray-200 rounded-full text-[10px]">
                  ✕
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          LOCATION CARDS GRID - AIRBNB STYLE
      ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {initialLocations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <LuAnchor className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-[#222222] mb-2">
              Lokasi tidak ditemukan
            </h3>
            <p className="text-[#717171] mb-6 max-w-sm">
              {search
                ? `Tidak ada hasil untuk "${search}". Coba kata kunci lain.`
                : "Belum ada dermaga yang terdaftar."}
            </p>
            <button
              onClick={() => router.push("/lokasi")}
              className="px-6 py-3 bg-[#FF385C] text-white rounded-full font-semibold hover:bg-[#E31C5F] transition-colors"
            >
              Lihat Semua Lokasi
            </button>
          </div>
        ) : (
          <>
            {/* Airbnb-style grid: 4 cols on xl, 3 on lg, 2 on md, 1 on sm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {initialLocations.map((location) => (
                <LocationCard key={location.id} location={location} />
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

                {/* Page numbers */}
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
// AIRBNB-STYLE LOCATION CARD
// ─────────────────────────────────────────────
function LocationCard({ location }: { location: Location }) {
  const [imgError, setImgError] = useState(false);
  const coverImage = location.image || location.previewBoats[0]?.image;

  return (
    <Link
      href={`/lokasi/${location.id}`}
      className="group block"
    >
      {/* Image Container - Airbnb aspect ratio ~3:2 */}
      <div className="relative aspect-[3/2] rounded-xl overflow-hidden bg-gray-100 mb-3">
        {coverImage && !imgError ? (
          <Image
            src={coverImage}
            alt={location.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <LuAnchor className="w-10 h-10 text-blue-200" />
          </div>
        )}

        {/* Favorite / Boat Count Badge */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
            <LuMapPin className="w-3.5 h-3.5 text-[#FF385C]" />
            <span className="text-xs font-semibold text-gray-900">
              {location.totalBoats} perahu
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="px-0.5">
        {/* Location Name */}
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <h3 className="font-semibold text-[15px] text-[#222222] group-hover:text-[#FF385C] transition-colors line-clamp-1">
            {location.name}
          </h3>
          {/* Chevron */}
          <LuChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-[#FF385C] transition-colors" />
        </div>

        {/* Region */}
        <p className="text-[13px] text-[#717171] mb-3 flex items-center gap-1">
          <LuMapPin className="w-3 h-3" />
          {location.region}
        </p>

        {/* Boat Previews - Airbnb-style avatars */}
        {location.previewBoats.length > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            {/* Boat avatars */}
            <div className="flex -space-x-2">
              {location.previewBoats.slice(0, 3).map((boat) => (
                <div
                  key={boat.id}
                  className="relative w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gray-100"
                >
                  {boat.image ? (
                    <Image
                      src={boat.image}
                      alt={boat.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LuAnchor className="w-3 h-3 text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <span className="text-[12px] text-[#717171]">
              {location.totalBoats > 3
                ? `+${location.totalBoats - 3} lainnya`
                : `${location.totalBoats} tersedia`}
            </span>
          </div>
        )}

        {/* Price Range Preview */}
        {location.previewBoats.length > 0 && (
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-[14px] font-semibold text-[#222222]">
              Rp{" "}
              {Math.min(...location.previewBoats.map((b) => b.price)).toLocaleString(
                "id-ID"
              )}
            </span>
            <span className="text-[13px] text-[#717171]">/ hari</span>
            {location.previewBoats.length > 1 && (
              <span className="text-[13px] text-[#717171]">
                {" "}
                - Rp{" "}
                {Math.max(...location.previewBoats.map((b) => b.price)).toLocaleString(
                  "id-ID"
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
