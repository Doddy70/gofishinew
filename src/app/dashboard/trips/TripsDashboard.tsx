"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  LuCalendar,
  LuShip,
  LuCreditCard,
  LuMessageCircle,
  LuCheck,
  LuClock,
  LuX,
  LuChevronRight,
  LuFilter,
  LuNavigation,
  LuUsers,
} from "react-icons/lu";

type TripBookingWithDetails = {
  id: string;
  seatsBooked: number;
  totalAmount: number;
  paymentStatus: string;
  paymentLink: string | null;
  createdAt: Date;
  tripMaster: {
    id: string;
    dateStart: Date;
    dateEnd: Date;
    bookingType: string;
    priceTotal: number;
    pricePerSeat: number | null;
    status: string;
    listing: {
      id: string;
      title: string;
      location: string;
      images: string[];
    };
    tripMaster: {
      user: {
        name: string;
        phone: string;
      };
    };
  };
};

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: typeof LuCheck }
> = {
  PENDING: {
    label: "Menunggu Pembayaran",
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
    icon: LuClock,
  },
  CONFIRMED: {
    label: "Dikonfirmasi",
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    icon: LuCheck,
  },
  CANCELLED: {
    label: "Dibatalkan",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    icon: LuX,
  },
  COMPLETED: {
    label: "Selesai",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    icon: LuCheck,
  },
};

const tripStatusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  SEARCHING: {
    label: "Mencari Ikan",
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  DEPARTED: {
    label: "Berangkat",
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  RETURNED: {
    label: "Pulang",
    color: "text-green-600",
    bg: "bg-green-100",
  },
  COMPLETED: {
    label: "Selesai",
    color: "text-gray-600",
    bg: "bg-gray-100",
  },
  CANCELLED: {
    label: "Dibatalkan",
    color: "text-red-600",
    bg: "bg-red-100",
  },
};

export default function TripsDashboard({
  bookings,
}: {
  bookings: TripBookingWithDetails[];
}) {
  const [filter, setFilter] = useState<string>("ALL");
  const [showFilters, setShowFilters] = useState(false);

  const filters = [
    { value: "ALL", label: "Semua" },
    { value: "PENDING", label: "Menunggu" },
    { value: "CONFIRMED", label: "Dikonfirmasi" },
    { value: "COMPLETED", label: "Selesai" },
    { value: "CANCELLED", label: "Dibatalkan" },
  ];

  const filteredBookings = bookings.filter((b) => {
    if (filter === "ALL") return true;
    return b.paymentStatus === filter;
  });

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getWhatsAppUrl = (booking: TripBookingWithDetails) => {
    const captainName = booking.tripMaster.tripMaster?.user?.name || "Kapten";
    const captainPhone = booking.tripMaster.tripMaster?.user?.phone;
    const listingTitle = booking.tripMaster.listing.title;
    const date = format(new Date(booking.tripMaster.dateStart), "dd MMM yyyy", {
      locale: id,
    });
    const message = `Halo Kapten ${captainName}, saya ingin konfirmasi booking ${listingTitle} pada ${date}.`;
    return captainPhone
      ? `https://wa.me/${captainPhone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
      : "#";
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
          Trip Saya
        </h1>
        <p className="text-gray-500 font-medium">
          Kelola pemesanan dan chat dengan kapten
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">
            Total
          </p>
          <p className="text-2xl font-black text-gray-900">{bookings.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
          <p className="text-sm font-bold text-yellow-600 uppercase tracking-wider mb-1">
            Pending
          </p>
          <p className="text-2xl font-black text-yellow-700">
            {bookings.filter((b) => b.paymentStatus === "PENDING").length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
          <p className="text-sm font-bold text-green-600 uppercase tracking-wider mb-1">
            Konfirmasi
          </p>
          <p className="text-2xl font-black text-green-700">
            {bookings.filter((b) => b.paymentStatus === "CONFIRMED").length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
          <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">
            Selesai
          </p>
          <p className="text-2xl font-black text-blue-700">
            {bookings.filter((b) => b.paymentStatus === "COMPLETED").length}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                filter === f.value
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden p-3 bg-white border border-gray-200 rounded-xl"
        >
          <LuFilter size={20} />
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <LuShip size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Belum Ada Trip
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === "ALL"
                ? "Mulai jelajahi dan pesan trip memancing favorit Anda"
                : `Tidak ada trip dengan status "${filters.find((f) => f.value === filter)?.label}"`}
            </p>
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-primary transition-colors"
            >
              <LuNavigation size={18} />
              Jelajahi Trip
            </Link>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const status = statusConfig[booking.paymentStatus] || statusConfig.PENDING;
            const tripStatus = tripStatusConfig[booking.tripMaster.status] || tripStatusConfig.SEARCHING;
            const StatusIcon = status.icon;
            const listing = booking.tripMaster.listing;
            const image = listing.images?.[0] || "/placeholder-boat.jpg";

            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Trip Image & Status */}
                <div className="relative h-48 md:h-56">
                  <img
                    src={image}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect fill='%23f3f4f6' width='400' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='14'%3E%F0%9F%90%A3%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase flex items-center gap-1.5 ${status.bg} ${status.color}`}>
                      <StatusIcon size={12} />
                      {status.label}
                    </span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase ${tripStatus.bg} ${tripStatus.color}`}>
                      {tripStatus.label}
                    </span>
                  </div>
                  {/* Booking ID */}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-lg text-xs font-mono">
                    #{booking.id.slice(-8).toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {listing.title}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5">
                        <LuShip size={14} />
                        {listing.location}
                      </p>
                    </div>
                    <p className="text-xl font-black text-gray-900">
                      {formatPrice(booking.totalAmount)}
                    </p>
                  </div>

                  {/* Trip Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-2xl mb-5">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Tanggal
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {format(
                          new Date(booking.tripMaster.dateStart),
                          "dd MMM yyyy",
                          { locale: id }
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Kursi
                      </p>
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                        <LuUsers size={14} />
                        {booking.seatsBooked}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Tipe
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {booking.tripMaster.bookingType === "PRIVATE"
                          ? "Private"
                          : "Sharing"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                        Kapten
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {booking.tripMaster.tripMaster?.user?.name || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {booking.paymentStatus === "PENDING" && booking.paymentLink && (
                      <a
                        href={booking.paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-3 bg-primary text-gray-900 rounded-xl font-bold text-sm hover:bg-orange-400 transition-colors"
                      >
                        <LuCreditCard size={18} />
                        Bayar Sekarang
                      </a>
                    )}
                    <a
                      href={getWhatsAppUrl(booking)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-5 py-3 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors"
                    >
                      <LuMessageCircle size={18} />
                      Chat Kapten
                    </a>
                    <Link
                      href={`/perahu/${// @ts-ignore
              listing.slug || listing.id}`}
                      className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                      Detail
                      <LuChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
