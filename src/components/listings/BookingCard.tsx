"use client";
import { DateRange, type Range } from "react-date-range";

import { useState } from "react";
import { addDays, differenceInCalendarDays, eachDayOfInterval, format } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Button from "../ui/Button";
import { LuCheck, LuInfo } from "react-icons/lu";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import CheckoutPriceBreakdown from "./CheckoutPriceBreakdown";

interface BookingCardProps {
  pricePerNight: number;
  listingId: string;
  hostId: string;
  tripMasters: {
    dateStart: string | Date;
    dateEnd: string | Date;
    status: string;
  }[];
  weekendPrice?: number | null;
  holidayPrice?: number | null;
  captainPhone?: string | null;
}

export default function BookingCard({
  pricePerNight,
  listingId,
  hostId,
  tripMasters,
  weekendPrice,
  holidayPrice,
  captainPhone
}: BookingCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userId } = useAuth();
  const isDisabledForKapten = userId === hostId;
  const [bookingType, setBookingType] = useState<"PRIVATE" | "SHARING">("PRIVATE");
  const [slotType, setSlotType] = useState<"MORNING" | "AFTERNOON" | "FULL_DAY">("FULL_DAY");
  const [seats, setSeats] = useState<number>(1);
  const [range, setRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 1),
      key: "selection",
    },
  ]);

  const startDate = range[0]?.startDate;
  const endDate = range[0]?.endDate;

  const nights =
    startDate && endDate
      ? Math.max(differenceInCalendarDays(endDate, startDate), 1)
      : 0;

  const calculateBreakdown = () => {
    if (!startDate || !endDate || nights === 0) return { total: 0, baseNights: 0, weekendNights: 0 };
    
    let current = new Date(startDate);
    let baseNights = 0;
    let weekendNights = 0;
    let total = 0;

    for (let i = 0; i < nights; i++) {
      const day = current.getDay();
      const isWeekend = day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
      
      if (isWeekend && weekendPrice) {
        weekendNights++;
        total += weekendPrice;
      } else {
        baseNights++;
        total += pricePerNight;
      }
      current = addDays(current, 1);
    }
    
    return { total, baseNights, weekendNights };
  };

  const { total, baseNights, weekendNights } = calculateBreakdown();

  const disabledDates = tripMasters
    .filter(trip => trip.status === "FULL" || trip.status === "CONFIRMED")
    .flatMap((trip) =>
      eachDayOfInterval({
        start: new Date(trip.dateStart),
        end: new Date(trip.dateEnd)
      }) 
    );

  const onReserve = async () => {
    if (!startDate || !endDate) return;

    if (!userId) {
      toast("Masuk untuk memesan!", {
        style: {
          background: "var(--color-primary)",
          color: "white",
        },
      });
      return;
    }

    try {
      setLoading(true);

      // Use /api/checkout with Midtrans payment
      const response = await axios.post("/api/checkout", {
        listingId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userId: userId,
        pmi: "fiat-qris-midtrans",
        bookingType,
        slotType,
        seats: bookingType === "SHARING" ? seats : undefined
      });

      if (response.data.success && response.data.payment?.redirectUrl) {
        // Redirect to Midtrans payment page
        window.location.href = response.data.payment.redirectUrl;
      } else {
        toast("Perahu berhasil dipesan", {
          style: {
            background: "var(--color-primary)",
            color: "white",
          },
        });
        router.refresh();
        router.push("/trips");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.response?.data.error || "Gagal memesan", {
          style: {
            background: "var(--color-primary)",
            color: "white",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="border border-hairline rounded-[16px] p-6 shadow-[rgba(0,0,0,0.12)_0px_6px_16px] bg-canvas">
        {/* price */}
        <div className="flex items-end gap-1 mb-6">
          <p className="text-[22px] font-semibold text-ink leading-none">
             Rp {pricePerNight.toLocaleString('id-ID')}
          </p>
          <span className="text-ink text-[15px]">malam</span>
        </div>

        {/* Booking Type Selector */}
        <div className="flex bg-surface-soft rounded-lg p-1 mb-6 border border-hairline-soft">
          <button 
            onClick={() => setBookingType("PRIVATE")}
            className={`flex-1 py-2 text-[15px] font-semibold rounded-md transition-all duration-200 ${bookingType === "PRIVATE" ? "bg-white shadow-sm text-ink ring-1 ring-hairline" : "text-muted hover:text-ink"}`}
          >
            Private Trip
          </button>
          <button 
            onClick={() => setBookingType("SHARING")}
            className={`flex-1 py-2 text-[15px] font-semibold rounded-md transition-all duration-200 ${bookingType === "SHARING" ? "bg-white shadow-sm text-ink ring-1 ring-hairline" : "text-muted hover:text-ink"}`}
          >
            Sharing Trip
          </button>
        </div>

        {/* Dates and Guests Grid */}
        <div className="border border-hairline rounded-lg overflow-hidden mb-6 flex flex-col">
          <div className="grid grid-cols-2 border-b border-hairline">
            <div className="p-3 border-r border-hairline hover:bg-surface-soft cursor-pointer transition">
              <p className="text-[10px] font-bold uppercase text-ink">Check-in</p>
              <p className="text-sm text-ink mt-0.5">
                {startDate ? format(startDate, "dd/MM/yyyy") : "Pilih tanggal"}
              </p>
            </div>
            <div className="p-3 hover:bg-surface-soft cursor-pointer transition">
              <p className="text-[10px] font-bold uppercase text-ink">Check-out</p>
              <p className="text-sm text-ink mt-0.5">
                {endDate ? format(endDate, "dd/MM/yyyy") : "Pilih tanggal"}
              </p>
            </div>
          </div>
          
          {/* Slot Type Selector */}
          <div className="p-3 cursor-pointer hover:bg-surface-soft transition">
            <p className="text-[10px] font-bold uppercase text-ink mb-2">Slot Waktu</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "MORNING", label: "Pagi", time: "05:00 - 12:00" },
                { id: "AFTERNOON", label: "Siang", time: "13:00 - 18:00" },
                { id: "FULL_DAY", label: "Full Day", time: "05:00 - 17:00" },
              ].map((slot) => (
                <div
                  key={slot.id}
                  onClick={() => setSlotType(slot.id as any)}
                  className={`px-1 py-2 rounded-lg border text-center transition-all duration-200 flex flex-col items-center justify-center ${
                    slotType === slot.id 
                      ? "border-ink bg-surface-soft text-ink ring-1 ring-ink" 
                      : "border-hairline hover:border-gray-300 text-muted"
                  }`}
                >
                  <span className="text-xs font-semibold">{slot.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seat Counter for Sharing Trip */}
        {bookingType === "SHARING" && (
          <div className="mb-6 border border-hairline rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-ink">Kapasitas Pancingan</p>
              <p className="text-xs text-muted">Jumlah orang / kursi</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSeats(Math.max(1, seats - 1))}
                className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-muted hover:border-ink hover:text-ink transition-colors disabled:opacity-50"
                disabled={seats <= 1}
              >-</button>
              <span className="font-semibold text-ink w-4 text-center">{seats}</span>
              <button 
                onClick={() => setSeats(seats + 1)}
                className="w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-muted hover:border-ink hover:text-ink transition-colors"
              >+</button>
            </div>
          </div>
        )}

        {/* calender */}
        <div className="overflow-hidden bg-white no-scrollbar airbnb-date-picker mb-6 flex justify-center -mx-4">
          <DateRange
            ranges={range}
            onChange={(item) => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            months={1}
            direction="horizontal"
            minDate={new Date()}
            showDateDisplay={false}
            rangeColors={["var(--color-ink)"]}
            disabledDates={disabledDates}
          />
        </div>

        {/* reservation button */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={onReserve}
            loading={loading}
            disabled={isDisabledForKapten || loading}
            className="w-full bg-primary hover:bg-primary-active text-white font-semibold py-3.5 rounded-lg transition-colors text-[16px]"
          >
            Pesan Sekarang
          </Button>
          
          <p className="text-center text-sm text-muted mt-2">
            Anda belum akan dikenakan biaya
          </p>

          <Button
            variant="outline"
            className="w-full mt-2 flex items-center justify-center gap-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 rounded-lg transition-colors"
            onClick={() => window.open(`https://wa.me/${captainPhone || '628123456789'}`, '_blank')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-2.32 0-4.525.903-6.163 2.541-1.638 1.638-2.541 3.842-2.541 6.162 0 1.25.266 2.454.793 3.551L3.03 21l2.648-1.071c1.057.514 2.221.785 3.424.785.001 0 .002 0 .003 0 4.808 0 8.718-3.91 8.718-8.718 0-2.32-.903-4.525-2.541-6.163-1.638-1.638-3.842-2.541-6.162-2.541zM9.03 9.462c.153 0 .308.018.455.052.193.044.385.114.566.211.233.125.467.319.646.549l.135.176c.092.122.181.246.265.372l.023.035c.146.219.284.444.415.674.011.021.022.041.033.062l.019.034.02.036c.119.222.231.45.334.685.011.024.021.048.031.073l.014.032c.11.258.209.521.295.789l.01.033c.088.28.163.565.225.854.004.02.008.04.013.061l.006.03c.068.324.114.653.136.985v.033c.022.332.022.665 0 .997v.03c-.022.335-.068.666-.136.993l-.006.03c-.005.021-.009.041-.013.061-.062.29-.137.576-.225.858l-.01.033c-.086.269-.185.533-.295.792l-.014.032c-.01.025-.021.049-.031.074-.103.235-.215.464-.334.687l-.02.036-.019.034c-.011.021-.022.041-.033.062-.131.23-.269.456-.415.675l-.023.035c-.084.126-.173.25-.265.372l-.135.176c-.179.23-.413.424-.646.549-.181.097-.373.167-.566.211-.147.034-.302.052-.455.052-.375 0-.746-.078-1.096-.231l-.031-.014-.034-.017c-.244-.122-.48-.262-.705-.418l-.03-.021c-.243-.169-.474-.352-.693-.548l-.028-.025c-.171-.154-.335-.316-.489-.485l-.023-.026c-.161-.179-.311-.368-.451-.565l-.015-.022c-.146-.208-.281-.424-.403-.648l-.01-.019-.011-.02c-.126-.233-.242-.474-.345-.722l-.008-.021c-.015-.038-.031-.077-.045-.116l-.005-.015c-.092-.266-.173-.538-.242-.815l-.003-.013c-.008-.034-.016-.068-.023-.102l-.001-.006c-.053-.255-.094-.515-.122-.777v-.016c-.008-.073-.015-.146-.021-.22v-.017c-.025-.333-.025-.668 0-1.002v-.017c.006-.074.013-.147.021-.22v-.016c.028-.263.069-.523.122-.778l.001-.006c.007-.034.015-.068.023-.102l.003-.013c.069-.277.15-.549.242-.816l.005-.015c.014-.039.03-.078.045-.116l.008-.021c.103-.248.219-.489.345-.722l.011-.02.01-.019c.122-.224.257-.44.403-.648l.015-.022c.14-.197.29-.386.451-.565l.023-.026c.154-.169.318-.331.489-.485l.028-.025c.219-.196.45-.379.693-.548l.03-.021c.225-.156.461-.296.705-.418l.034-.017.031-.014c.35-.153.721-.231 1.096-.231z"></path></svg>
            Tanya Kapten
          </Button>
        </div>

        <hr className="my-6 border-hairline" />

        {/* pricing breakdown */}
        <CheckoutPriceBreakdown 
          nights={nights}
          baseNights={baseNights}
          weekendNights={weekendNights}
          pricePerNight={pricePerNight}
          weekendPrice={weekendPrice}
          total={total}
        />
      </div>
      
      <div className="flex items-start gap-3 p-4 bg-surface-soft border border-hairline rounded-lg">
         <LuInfo className="text-ink shrink-0 mt-0.5" size={18} />
         <p className="text-sm text-ink leading-relaxed">
           <span className="font-semibold block mb-1">Catatan Pemesanan:</span>
           Harga dapat berubah tergantung pada musim atau permintaan khusus. Silakan hubungi Kapten setelah memesan.
         </p>
      </div>
    </div>
  );
}
