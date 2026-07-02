"use client";
import { DateRange, type Range } from "react-date-range";

import { useState } from "react";
import { addDays, differenceInCalendarDays, eachDayOfInterval, format } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Button from "../ui/Button";
import { LuCheck } from "react-icons/lu";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface BookingCardProps {
  pricePerNight: number;
  listingId: string;
  hostId: string;
  reservations:{
    startDate:string,
    endDate:string
  }[]
}

export default function BookingCard({
  pricePerNight,
  listingId,
  hostId,
  reservations
}: BookingCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const isDisabledForKapten = session?.user.id === hostId;
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

  const total = nights * pricePerNight;

  const disabledDates = reservations.flatMap((reservation) =>
    eachDayOfInterval({
      start:new Date(reservation.startDate),
      end:new Date(reservation.endDate)
    }) 
  )

  const onReserve = async () => {
    if (!startDate || !endDate) return;

    if (!session) {
      toast("Masuk untuk memesan!", {
        style: {
          background: "#FF5A5F",
          color: "white",
        },
      });
      return;
    }

    try {
      setLoading(true);

      await axios.post("/api/reservations", {
        startDate,
        endDate,
        listingId,
        totalPrice: total,
      });

      toast("Perahu berhasil dipesan", {
        style: {
          background: "#FF5A5F",
          color: "white",
        },
      });

      router.refresh();
      router.push("/trips")
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast(error.response?.data.error, {
          style: {
            background: "#FF5A5F",
            color: "white",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="lg:sticky lg:top-8">
      <div className="border border-[var(--color-hairline)] rounded-[12px] p-2 sm:p-5 shadow-[rgba(0,0,0,0.12)_0px_6px_16px] bg-[var(--color-canvas)]">
        {/* price */}
        <div className="flex items-center gap-1 mb-6">
          <p className="text-[22px] font-bold text-[var(--color-ink)] leading-none">
             Rp {pricePerNight.toLocaleString('id-ID')}
          </p>
          <span className="text-[var(--color-ink)] font-light text-[14px] mt-1">hari</span>
        </div>

        {/* calender */}
        <div className="overflow-auto bg-white no-scrollbar">
          <DateRange
            ranges={range}
            onChange={(item) => setRange([item.selection])}
            moveRangeOnFirstSelection={false}
            months={1}
            direction="horizontal"
            minDate={new Date()}
            showDateDisplay={false}
            rangeColors={["var(--color-primary)"]}
            disabledDates={disabledDates}
          />
        </div>

        {/* selected dates */}
        <div className="border border-[var(--color-hairline)] rounded-[var(--rounded-sm)] overflow-hidden mt-4 mb-6">
          <div className="grid grid-cols-2">
            <div className="p-3 border-r border-[var(--color-hairline)]">
              <p className="text-[10px] font-bold uppercase text-[var(--color-ink)]">Mulai Sewa</p>
              <p className="text-sm text-[var(--color-ink)]">
                {startDate ? format(startDate, "dd/MM/yyyy") : "-"}
              </p>
            </div>
            <div className="p-3">
              <p className="text-[10px] font-bold uppercase text-[var(--color-ink)]">Selesai Sewa</p>
              <p className="text-sm text-[var(--color-ink)]">
                {endDate ? format(endDate, "dd/MM/yyyy") : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* pricing */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-[var(--color-muted)] text-sm">
            <span className="underline">
              Rp {pricePerNight.toLocaleString('id-ID')} x {nights} hari
            </span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>

          <div className="border-t border-[var(--color-hairline)] pt-4 flex justify-between font-bold text-base text-[var(--color-ink)]">
            <span>Total</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* reservation button */}
        <div className="flex flex-col gap-3">
          <Button
            rounded
            onClick={onReserve}
            loading={loading}
            disabled={isDisabledForKapten || loading}
          >
            Pesan Sekarang
          </Button>

          <Button
            variant="outline"
            rounded
            className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50"
            onClick={() => window.open(`https://wa.me/${listing.user.phone || '628123456789'}`, '_blank')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-2.32 0-4.525.903-6.163 2.541-1.638 1.638-2.541 3.842-2.541 6.162 0 1.25.266 2.454.793 3.551L3.03 21l2.648-1.071c1.057.514 2.221.785 3.424.785.001 0 .002 0 .003 0 4.808 0 8.718-3.91 8.718-8.718 0-2.32-.903-4.525-2.541-6.163-1.638-1.638-3.842-2.541-6.162-2.541zM9.03 9.462c.153 0 .308.018.455.052.193.044.385.114.566.211.233.125.467.319.646.549l.135.176c.092.122.181.246.265.372l.023.035c.146.219.284.444.415.674.011.021.022.041.033.062l.019.034.02.036c.119.222.231.45.334.685.011.024.021.048.031.073l.014.032c.11.258.209.521.295.789l.01.033c.088.28.163.565.225.854.004.02.008.04.013.061l.006.03c.068.324.114.653.136.985v.033c.022.332.022.665 0 .997v.03c-.022.335-.068.666-.136.993l-.006.03c-.005.021-.009.041-.013.061-.062.29-.137.576-.225.858l-.01.033c-.086.269-.185.533-.295.792l-.014.032c-.01.025-.021.049-.031.074-.103.235-.215.464-.334.687l-.02.036-.019.034c-.011.021-.022.041-.033.062-.131.23-.269.456-.415.675l-.023.035c-.084.126-.173.25-.265.372l-.135.176c-.179.23-.413.424-.646.549-.181.097-.373.167-.566.211-.147.034-.302.052-.455.052-.375 0-.746-.078-1.096-.231l-.031-.014-.034-.017c-.244-.122-.48-.262-.705-.418l-.03-.021c-.243-.169-.474-.352-.693-.548l-.028-.025c-.171-.154-.335-.316-.489-.485l-.023-.026c-.161-.179-.311-.368-.451-.565l-.015-.022c-.146-.208-.281-.424-.403-.648l-.01-.019-.011-.02c-.126-.233-.242-.474-.345-.722l-.008-.021c-.015-.038-.031-.077-.045-.116l-.005-.015c-.092-.266-.173-.538-.242-.815l-.003-.013c-.008-.034-.016-.068-.023-.102l-.001-.006c-.053-.255-.094-.515-.122-.777v-.016c-.008-.073-.015-.146-.021-.22v-.017c-.025-.333-.025-.668 0-1.002v-.017c.006-.074.013-.147.021-.22v-.016c.028-.263.069-.523.122-.778l.001-.006c.007-.034.015-.068.023-.102l.003-.013c.069-.277.15-.549.242-.816l.005-.015c.014-.039.03-.078.045-.116l.008-.021c.103-.248.219-.489.345-.722l.011-.02.01-.019c.122-.224.257-.44.403-.648l.015-.022c.14-.197.29-.386.451-.565l.023-.026c.154-.169.318-.331.489-.485l.028-.025c.219-.196.45-.379.693-.548l.03-.021c.225-.156.461-.296.705-.418l.034-.017.031-.014c.35-.153.721-.231 1.096-.231z"></path></svg>
            Tanya Kapten
          </Button>
        </div>

        <p className="text-center text-sm text-[var(--color-muted)] mt-4">
          <LuCheck className="inline mr-1 text-green-500" size={16} />
          Anda belum akan dikenakan biaya
        </p>
      </div>
    </div>
  );
}
