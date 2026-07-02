import { LuCreditCard, LuCheckCircle, LuSettings, LuWallet } from "react-icons/lu";

export default function PaymentGatewaysPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Payment Gateways</h1>
          <p className="text-gray-500 font-medium">Konfigurasi jalur utama pembayaran menggunakan Midtrans dan Xendit (QRIS).</p>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-primary/20">
          Simpan Perubahan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Midtrans Configuration */}
        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6">
            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <LuCheckCircle size={14} /> Aktif Utama
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
              <LuWallet size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Midtrans</h2>
              <p className="text-sm font-medium text-gray-400">fiat-qris-midtrans</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Server Key</label>
              <input type="password" value="SB-Mid-server-xxxxxxxxxxxxxxxxx" readOnly className="w-full bg-gray-50 border-none text-gray-700 font-mono text-sm rounded-xl px-4 py-3 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Client Key</label>
              <input type="text" value="SB-Mid-client-xxxxxxxxxxxxxxxxx" readOnly className="w-full bg-gray-50 border-none text-gray-700 font-mono text-sm rounded-xl px-4 py-3 outline-none" />
            </div>
          </div>
        </div>

        {/* Xendit Configuration */}
        <div className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <LuCreditCard size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900">Xendit</h2>
              <p className="text-sm font-medium text-gray-400">fiat-qris-xendit</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Secret Key</label>
              <input type="password" value="xnd_development_xxxxxxxxxxxxxxxx" readOnly className="w-full bg-gray-50 border-none text-gray-700 font-mono text-sm rounded-xl px-4 py-3 outline-none" />
            </div>
            <div className="pt-2">
              <button className="flex items-center justify-center w-full gap-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-xl transition">
                <LuSettings size={16} /> Konfigurasi Lanjut
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
