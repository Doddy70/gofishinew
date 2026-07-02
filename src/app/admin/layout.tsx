import { getCurrentUser } from "@/server-actions/getCurrentUser";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LuLayoutDashboard, 
  LuShieldCheck, 
  LuUsers, 
  LuFileText,
  LuMapPin,
  LuNavigation,
  LuPercent,
  LuCloudLightning,
  LuTriangleAlert,
  LuMessageSquare,
  LuTrendingUp,
  LuCreditCard,
  LuLifeBuoy,
  LuShip,
  LuWallet,
  LuSettings,
  LuGlobe,
  LuUserCog
} from "react-icons/lu";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  // Strict Admin Guard
  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-6rem)] bg-gray-50">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col border-r border-gray-800">
        <div className="p-6">
          <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
            <span className="text-primary">Admin</span> Panel
          </h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">GoFishi Command Center</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {/* 1. Dashboard Utama */}
          <div className="space-y-1">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-primary text-white rounded-xl shadow-lg shadow-primary/20 transition font-bold">
              <LuLayoutDashboard size={20} />
              Overview & Analytics
            </Link>
          </div>

          {/* 2. Manajemen Kapten */}
          <div className="space-y-1">
            <h3 className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">2. Manajemen Kapten</h3>
            <Link href="/admin/vendor/onboarding" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuShieldCheck size={18} />
              Verifikasi & Onboarding
            </Link>
            <Link href="/admin/vendor/commission" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuPercent size={18} />
              Komisi & Langganan
            </Link>
            <Link href="/admin/vendor/performance" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuTrendingUp size={18} />
              Performance Monitoring
            </Link>
          </div>

          {/* 3. Manajemen Inventaris Perahu & Lokasi */}
          <div className="space-y-1">
            <h3 className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">3. Perahu & Lokasi</h3>
            <Link href="/admin/inventory/listings" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuShip size={18} />
              Moderasi Perahu
            </Link>
            <Link href="/admin/inventory/calendar" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuFileText size={18} />
              Manajemen Ketersediaan
            </Link>
            <Link href="/admin/inventory/locations" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuMapPin size={18} />
              Lokasi Dermaga
            </Link>
          </div>

          {/* 4. Manajemen Transaksi & Keuangan */}
          <div className="space-y-1">
            <h3 className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">4. Transaksi & Keuangan</h3>
            <Link href="/admin/finance/payouts" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuWallet size={18} />
              Automated Payouts
            </Link>
            <Link href="/admin/finance/invoices" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuCreditCard size={18} />
              Invoice & Pajak
            </Link>
            <Link href="/admin/finance/disputes" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuTriangleAlert size={18} />
              Refund & Dispute
            </Link>
          </div>

          {/* 5. Manajemen Penyewa */}
          <div className="space-y-1">
            <h3 className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">5. Manajemen Penyewa</h3>
            <Link href="/admin/anglers/database" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuUsers size={18} />
              Database Pengguna
            </Link>
            <Link href="/admin/anglers/waivers" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuFileText size={18} />
              Waiver Management
            </Link>
          </div>

          {/* 6. Fitur Khusus Maritim */}
          <div className="space-y-1">
            <h3 className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">6. Maritim & Ops</h3>
            <Link href="/admin/maritime/tracking" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuNavigation size={18} />
              Tracking Lokasi GPS
            </Link>
            <Link href="/admin/maritime/maintenance" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuCloudLightning size={18} />
              Maintenance Logs
            </Link>
          </div>

          {/* 7. Sistem CRM & Konten */}
          <div className="space-y-1">
            <h3 className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">7. CRM & Konten</h3>
            <Link href="/admin/crm/marketing" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuMessageSquare size={18} />
              Email/SMS Marketing
            </Link>
            <Link href="/admin/crm/cms" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuLifeBuoy size={18} />
              CMS & Panduan
            </Link>
          </div>

          {/* 8. Pengaturan Sistem */}
          <div className="space-y-1">
            <h3 className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">8. Sistem & Akses</h3>
            <Link href="/admin/settings/rbac" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuSettings size={18} />
              Hak Akses (RBAC)
            </Link>
            <Link href="/admin/settings/localization" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuGlobe size={18} />
              Bahasa & Mata Uang
            </Link>
            <Link href="/admin/settings/impersonate" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuUserCog size={18} />
              User Impersonation
            </Link>
          </div>

          {/* 9. Payment Gateways */}
          <div className="space-y-1">
            <h3 className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">9. Payment Gateways</h3>
            <Link href="/admin/payments/gateways" className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition font-medium text-sm">
              <LuCreditCard size={18} />
              Midtrans & Xendit
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
