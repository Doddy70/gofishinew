import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { LuShip, LuUsers, LuCalendar, LuTrophy, LuMessageSquare, LuChevronRight } from "react-icons/lu";
import Link from "next/link";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();

  console.log('DEBUG: DASHBOARD_PAGE USER', currentUser ? `FOUND: ${currentUser.email || currentUser.name}` : 'NOT FOUND - REDIRECTING');

  if (!currentUser) {
    redirect("/");
  }

  try {
    // Statistics
    const boatCount = await prisma.listing.count({
      where: currentUser.role === "ADMIN" ? {} : { userId: currentUser.id }
    });

    const reservationCount = await prisma.reservation.count({
      where: currentUser.role === "ADMIN" ? {} : { listing: { userId: currentUser.id } }
    });

    // Get tasks (Pending reservations)
    const pendingReservations = await prisma.reservation.findMany({
      where: {
        listing: { userId: currentUser.id },
        status: "PENDING"
      },
      include: { user: true, listing: true },
      take: 5,
      orderBy: { createdAt: "desc" }
    });

    const stats = [
      { label: "Armada", value: boatCount, icon: LuShip, color: "bg-blue-500" },
      { label: "Trip Selesai", value: reservationCount, icon: LuCalendar, color: "bg-green-500" },
      ...(currentUser.role === "ADMIN" ? [{ label: "Pengguna", value: await prisma.user.count(), icon: LuUsers, color: "bg-purple-500" }] : [])
    ];

    return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Selamat datang, {currentUser.name}! 👋</h1>
          <p className="text-gray-500 font-medium">Inilah ringkasan operasional armada Anda hari ini.</p>
        </div>
        <Link href="/dashboard/calendar" className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition shadow-lg shadow-gray-200">
          <LuCalendar size={18} />
          Buka Kalender
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed: Tasks & Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tasks Section (Airbnb "Hari Ini" Style) */}
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-primary rounded-full" />
                Tugas Anda
              </h2>
              <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-wider">
                {pendingReservations.length} Pending
              </span>
            </div>

            <div className="space-y-4">
              {pendingReservations.map((res) => (
                <div key={res.id} className="p-5 bg-gray-50 rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-md hover:border-gray-200 border border-transparent transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-gray-100">
                      <LuCalendar size={22} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Konfirmasi Reservasi</p>
                      <p className="text-sm text-gray-500 font-medium">{res.user.name} • {res.listing.title}</p>
                    </div>
                  </div>
                  <Link href="/dashboard/reservations" className="p-3 bg-gray-900 text-white rounded-xl hover:bg-primary transition-colors">
                    <LuChevronRight size={20} />
                  </Link>
                </div>
              ))}
              {pendingReservations.length === 0 && (
                <div className="py-12 text-center space-y-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <LuTrophy size={32} />
                  </div>
                  <p className="text-gray-400 font-medium italic">Semua tugas beres! Tidak ada pesanan tertunda.</p>
                </div>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat) => (
               <div key={stat.label} className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm flex items-center gap-5 hover:border-primary/20 transition-colors">
                  <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    <stat.icon size={26} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                  </div>
               </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Tips & Support */}
        <div className="space-y-6">
          <div className="bg-gray-900 p-8 rounded-[32px] text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <LuTrophy className="text-primary" /> Tips Pro Kapten
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Penyewa cenderung memilih Kapten yang memiliki <span className="text-white font-bold italic">Fishing Log</span> yang aktif. Pastikan Anda mengunggah foto tangkapan terbaru!
            </p>
            <Link href="/dashboard/fishing-log" className="block w-full py-4 bg-primary text-gray-900 text-center font-bold rounded-2xl hover:bg-orange-400 transition transform hover:-translate-y-1">
              Update Spot Gacor
            </Link>
          </div>

          <div className="bg-blue-600 p-8 rounded-[32px] text-white shadow-xl shadow-blue-600/20">
             <div className="flex items-center gap-3 mb-4">
                <LuMessageSquare size={24} />
                <h3 className="text-lg font-bold">Butuh Bantuan?</h3>
             </div>
             <p className="text-blue-100 text-sm mb-6">Tim support GoFishi siap membantu operasional armada Anda 24/7.</p>
             <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-bold transition">
                Hubungi Support
             </button>
          </div>
        </div>
      </div>
    </div>
    );
  } catch (error) {
    console.error('DEBUG: DASHBOARD_PAGE ERROR', error);
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Terjadi kesalahan saat memuat dashboard.</h1>
        <p className="text-gray-500">{error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    );
  }
}
