import { getCurrentUser } from "@/server-actions/getCurrentUser";
import AdminClient from "./AdminClient";
import { LuUsers, LuShip, LuShieldCheck, LuWallet, LuTrendingUp, LuTriangleAlert } from "react-icons/lu";
import { dashboardService } from "@/services/dashboardService";

type PendingKaptenType = {
  id: string;
  name: string | null;
  email: string | null;
  listings: {
    id: string;
    title: string;
    boatType: string;
    legalDocs: string[];
  }[];
};

type AlertType = {
  id: string;
  type: string;
  message: string;
  time: string;
};

export default async function AdminDashboard() {
  await getCurrentUser(); // Call to ensure session, but we don't assign if not used

  // Uncomment this for strict security later!
  // const currentUser = await getCurrentUser();
  // if (!currentUser || currentUser.role !== "ADMIN") {
  //   redirect("/");
  // }

  let totalUsers = 0;
  let totalListings = 0;
  let totalReservations = 0;
  let gmv = 0;
  let adminCommission = 0;
  let activeReservations = 0;
  let pendingKaptens: PendingKaptenType[] = [];
  let recentAlerts: AlertType[] = [];
  let fetchError = false;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
  };

  try {
    // Platform Metrics & Pending Verifications via Service Layer (Backend Guidelines)
    const metrics = await dashboardService.getDashboardMetrics();

    totalUsers = metrics.usersCount;
    totalListings = metrics.listingsCount;
    totalReservations = metrics.reservationsCount;
    gmv = metrics.gmv;
    adminCommission = metrics.adminCommission;
    activeReservations = metrics.activeReservations;
    recentAlerts = metrics.alerts;
    
    // Typecast to avoid prisma complex type issues if any
    pendingKaptens = metrics.pendingUsers as unknown as PendingKaptenType[];
  } catch (error) {
    console.error("Database connection failed on Admin Dashboard:", error);
    fetchError = true;
  }

  const stats = [
    { label: "Pendapatan (GMV)", value: fetchError ? "-" : formatCurrency(gmv), icon: LuWallet, color: "bg-green-500", trend: "+15% minggu ini" },
    { label: "Komisi Admin", value: fetchError ? "-" : formatCurrency(adminCommission), icon: LuTrendingUp, color: "bg-blue-500", trend: "15% dari GMV" },
    { label: "Penyewaan Aktif", value: fetchError ? "-" : activeReservations, icon: LuShip, color: "bg-cyan-500", trend: "Sedang beroperasi" },
    { label: "Total Pengguna", value: fetchError ? "-" : totalUsers, icon: LuUsers, color: "bg-orange-500", trend: "+12% bulan ini" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Control Panel ⚙️</h1>
          <p className="text-gray-500 font-medium">Ringkasan performa platform GoFishi secara keseluruhan.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
           <div key={stat.label} className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col gap-4 hover:border-primary/20 transition-all hover:-translate-y-1">
              <div className="flex justify-between items-start">
                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  <stat.icon size={26} />
                </div>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full flex items-center gap-1">
                  <LuTrendingUp size={12} /> {stat.trend}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-4xl font-black text-gray-900">{stat.value}</p>
              </div>
           </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Graph Placeholder */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-blue-500 rounded-full" />
                Grafik Tren Penyewaan
              </h2>
              <select className="bg-gray-50 border-none text-sm font-bold text-gray-600 rounded-xl px-4 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-primary/20">
                <option>Minggu Ini</option>
                <option>Bulan Ini</option>
                <option>Tahun Ini</option>
              </select>
            </div>
            
            <div className="flex-1 min-h-[200px] flex items-end gap-2 justify-between pt-8">
              {/* Dummy bars for visual effect */}
              {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                <div key={i} className="w-full bg-blue-50 rounded-t-lg relative group transition-all duration-300 hover:bg-blue-100" style={{ height: `${height}%` }}>
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded-md whitespace-nowrap">
                    {height * 12} Booking
                  </div>
                  <div className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${i === 6 ? 'bg-primary' : 'bg-blue-300 group-hover:bg-blue-400'}`} style={{ height: `${height * 0.7}%` }}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
            </div>
          </div>
        </div>

        {/* Alerts Widget */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50 h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-red-500 rounded-full" />
                Peringatan Sistem
              </h2>
              <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-black">{recentAlerts.length}</span>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto pr-2">
              {fetchError ? (
                <div className="p-4 bg-gray-50 rounded-2xl text-center text-sm font-medium text-gray-400">Gagal memuat notifikasi</div>
              ) : recentAlerts.length === 0 ? (
                <div className="p-4 bg-green-50 rounded-2xl text-center text-sm font-bold text-green-600">Semua sistem normal. Tidak ada peringatan.</div>
              ) : (
                recentAlerts.map(alert => (
                  <div key={alert.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group">
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${alert.type === 'urgent' ? 'bg-red-500' : alert.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                      <div>
                        <p className="text-sm font-bold text-gray-700 leading-snug group-hover:text-primary transition-colors">{alert.message}</p>
                        <p className="text-xs font-medium text-gray-400 mt-2">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Verification Table */}
        <div className="lg:col-span-3">
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-orange-500 rounded-full" />
                Antrean Verifikasi Kapten
              </h2>
              <span className="px-3 py-1 bg-orange-500/10 text-orange-600 text-xs font-black rounded-full uppercase tracking-wider">
                {pendingKaptens.length} Pending
              </span>
            </div>

            {fetchError ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 flex flex-col items-center justify-center text-center space-y-3">
                <LuTriangleAlert size={40} className="text-red-500 mb-2" />
                <h3 className="text-lg font-bold">Koneksi Database Gagal</h3>
                <p className="text-sm">Kami tidak dapat memuat data antrean verifikasi saat ini. Silakan muat ulang halaman atau periksa koneksi database Anda.</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition">
                  Coba Lagi
                </button>
              </div>
            ) : pendingKaptens.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <LuShieldCheck size={32} />
                </div>
                <p className="text-gray-400 font-medium italic">Semua kapten telah terverifikasi. Tidak ada antrean.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-6 py-4 font-bold rounded-tl-2xl">Nama Kapten</th>
                      <th className="px-6 py-4 font-bold">Email</th>
                      <th className="px-6 py-4 font-bold">Data Kapal</th>
                      <th className="px-6 py-4 font-bold">Dokumen Legal</th>
                      <th className="px-6 py-4 font-bold text-right rounded-tr-2xl">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pendingKaptens.map((host) => (
                      <tr key={host.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-gray-900">{host.name}</td>
                        <td className="px-6 py-4 font-medium text-gray-500">{host.email}</td>
                        <td className="px-6 py-4">
                          {host.listings.length > 0 ? (
                            <div className="flex flex-col gap-1">
                              {host.listings.map((l) => (
                                <span key={l.id} className="bg-gray-100 px-2 py-1 rounded-md text-xs font-bold text-gray-600">
                                  {l.boatType}: {l.title}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic font-medium">Belum ada perahu</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {host.listings.some((l) => l.legalDocs && l.legalDocs.length > 0) ? (
                            <a 
                              href={host.listings.find((l) => l.legalDocs && l.legalDocs.length > 0)?.legalDocs[0]} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-primary hover:text-orange-500 font-bold transition-colors"
                            >
                              Lihat Grosse Akta
                            </a>
                          ) : (
                            <span className="text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded-md">Missing Docs</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <AdminClient userId={host.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
