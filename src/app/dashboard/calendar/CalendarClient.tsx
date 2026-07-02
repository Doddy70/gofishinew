"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  LuCalendar, 
  LuLock, 
  LuInfo, 
  LuChevronLeft, 
  LuChevronRight, 
  LuTrash2,
  LuPlus,
  LuClock
} from "react-icons/lu";
import Button from "@/components/ui/Button";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isToday,
  parseISO
} from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CalendarClientProps {
  listings: any[];
}

export default function CalendarClient({ listings }: CalendarClientProps) {
  const router = useRouter();
  const [selectedListingId, setSelectedListingId] = useState(listings[0]?.id || "");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [blockReason, setBlockReason] = useState("Maintenance");

  const activeListing = useMemo(() => 
    listings.find(l => l.id === selectedListingId), 
    [listings, selectedListingId]
  );

  // Calendar Logic
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let day = startDate;

    while (day <= endDate) {
      rows.push(day);
      day = addDays(day, 1);
    }
    return rows;
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getDayStatus = (day: Date) => {
    const reservation = activeListing?.reservations?.find((r: any) => 
      isSameDay(parseISO(r.startDate), day)
    );
    const blocked = activeListing?.blockedDates?.find((b: any) => 
      isSameDay(parseISO(b.date), day)
    );

    return { reservation, blocked };
  };

  const handleDateClick = (day: Date) => {
    const { reservation, blocked } = getDayStatus(day);
    if (reservation) return; // Can't block if reserved
    
    setSelectedDate(day);
    if (blocked) {
      // Logic for unblocking will be handled in UI
    } else {
      setShowBlockModal(true);
    }
  };

  const onBlockDate = async () => {
    if (!selectedDate || !selectedListingId) return;

    setLoading(true);
    try {
      await axios.post("/api/dashboard/calendar/block", { 
        listingId: selectedListingId, 
        date: format(selectedDate, "yyyy-MM-dd"), 
        reason: blockReason 
      });
      toast.success("Tanggal berhasil diblokir");
      setShowBlockModal(false);
      router.refresh();
    } catch (error) {
      toast.error("Gagal memblokir tanggal");
    } finally {
      setLoading(false);
    }
  };

  const onUnblockDate = async (blockedId: string) => {
    setLoading(true);
    try {
      await axios.delete(`/api/dashboard/calendar/block?id=${blockedId}`);
      toast.success("Blokir tanggal dihapus");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menghapus blokir");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Listing Selector & Header */}
      <div className="flex flex-col md:flex-row gap-4 items-end justify-between bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="w-full md:w-1/3">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pilih Armada</label>
          <select 
            value={selectedListingId}
            onChange={(e) => setSelectedListingId(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 transition-all font-semibold text-gray-700"
          >
            {listings.map((l) => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl flex items-center gap-2 text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                {activeListing?.reservations?.length || 0} Trip Aktif
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 text-sm font-medium">
                <LuLock size={16} />
                {activeListing?.blockedDates?.length || 0} Tanggal Terblokir
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{format(currentMonth, "MMMM yyyy", { locale: id })}</h2>
                <p className="text-sm text-gray-400 capitalize">{activeListing?.title}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <LuChevronLeft size={24} />
                </button>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <LuChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-4">
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 border-t border-l border-gray-50">
              {days.map((day, i) => {
                const { reservation, blocked } = getDayStatus(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                
                return (
                  <div 
                    key={i} 
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      "h-32 border-r border-b border-gray-50 p-2 transition-all cursor-pointer relative group",
                      !isCurrentMonth && "bg-gray-50/50 opacity-30",
                      isToday(day) && "bg-blue-50/30",
                      "hover:bg-gray-50"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-semibold",
                      isToday(day) ? "text-blue-600" : "text-gray-700",
                      !isCurrentMonth && "font-normal"
                    )}>
                      {format(day, "d")}
                    </span>

                    {reservation && (
                      <div className="mt-2 p-1.5 bg-blue-600 rounded-lg shadow-sm">
                        <p className="text-[10px] font-bold text-white truncate">{reservation.user?.name || "Guest"}</p>
                        <p className="text-[8px] text-blue-100 truncate">{reservation.bookingType}</p>
                      </div>
                    )}

                    {blocked && (
                      <div className="mt-2 p-1.5 bg-red-100 border border-red-200 rounded-lg group-hover:bg-red-200 transition-colors">
                        <div className="flex justify-between items-start">
                            <p className="text-[10px] font-bold text-red-700 truncate">{blocked.reason || "Blocked"}</p>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUnblockDate(blocked.id);
                                }}
                                className="text-red-400 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <LuTrash2 size={12} />
                            </button>
                        </div>
                      </div>
                    )}
                    
                    {!reservation && !blocked && isCurrentMonth && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="p-2 bg-gray-900/5 rounded-full text-gray-400">
                                <LuPlus size={20} />
                            </div>
                        </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Info & Packages Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <LuClock className="text-primary" /> Pengaturan Slot Waktu
            </h3>
            <div className="space-y-3">
                {activeListing?.rentalPackages?.map((pkg: any) => (
                    <div key={pkg.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-sm font-bold text-gray-800">{pkg.days} Hari Trip</p>
                        <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
                            <span>{pkg.meetingTime} - {pkg.returnTime}</span>
                            <span className="text-primary">{pkg.price.toLocaleString()} IDR</span>
                        </div>
                    </div>
                ))}
                {activeListing?.rentalPackages?.length === 0 && (
                    <p className="text-sm text-gray-400 italic">Belum ada paket sewa.</p>
                )}
            </div>
            <Button className="w-full mt-4 bg-gray-900 text-sm">
                Kelola Paket Sewa
            </Button>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
            <div className="flex gap-3">
                <LuInfo className="text-amber-600 shrink-0" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-amber-900 mb-1">Tips Kalender</h4>
                    <p className="text-xs text-amber-700 leading-relaxed">
                        Klik pada tanggal kosong untuk memblokir ketersediaan (maintenance/libur). 
                        Tanggal yang sudah ada pesanan tidak bisa diblokir.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Block Date Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Blokir Tanggal</h3>
            <p className="text-gray-500 mb-6 text-sm">
                Tutup ketersediaan armada pada tanggal <span className="font-bold text-gray-900">{selectedDate && format(selectedDate, "dd MMMM yyyy", { locale: id })}</span>.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Alasan Pemblokiran</label>
                <select 
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/10 font-medium"
                >
                  <option value="Maintenance">Perbaikan Kapal (Maintenance)</option>
                  <option value="Private Use">Digunakan Pribadi</option>
                  <option value="Bad Weather">Cuaca Buruk</option>
                  <option value="Other">Lainnya</option>
                </select>
              </div>

              <div className="flex gap-3 mt-8">
                <Button 
                    onClick={() => setShowBlockModal(false)}
                    className="flex-1 bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                    Batal
                </Button>
                <Button 
                    onClick={onBlockDate}
                    loading={loading}
                    className="flex-1"
                >
                    Blokir Sekarang
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
