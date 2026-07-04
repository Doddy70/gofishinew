import { differenceInCalendarDays, addDays } from "date-fns";

interface CheckoutPriceBreakdownProps {
  pricePerNight: number;
  weekendPrice?: number | null;
  holidayPrice?: number | null;
  startDate: Date | null;
  endDate: Date | null;
}

export default function CheckoutPriceBreakdown({
  pricePerNight,
  weekendPrice,
  holidayPrice,
  startDate,
  endDate,
}: CheckoutPriceBreakdownProps) {
  if (!startDate || !endDate) return null;

  const nights = Math.max(differenceInCalendarDays(endDate, startDate), 1);
  
  const calculateBreakdown = () => {
    let current = new Date(startDate);
    let baseNights = 0;
    let weekendNights = 0;
    let total = 0;

    for (let i = 0; i < nights; i++) {
      const day = current.getDay();
      const isWeekend = day === 0 || day === 6; // Sunday or Saturday
      
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
  
  // Asumsi biaya layanan atau pajak, misalnya 5%
  const serviceFee = Math.round(total * 0.05);
  const grandTotal = total + serviceFee;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
        Rincian Harga
      </h3>
      
      <div className="space-y-3 mb-4">
        {baseNights > 0 && (
          <div className="flex justify-between items-center text-sm font-medium text-gray-700">
            <span>
              {formatIDR(pricePerNight)} x {baseNights} malam (Reguler)
            </span>
            <span>{formatIDR(pricePerNight * baseNights)}</span>
          </div>
        )}
        
        {weekendNights > 0 && weekendPrice && (
          <div className="flex justify-between items-center text-sm font-medium text-gray-700">
            <span>
              {formatIDR(weekendPrice)} x {weekendNights} malam (Akhir Pekan)
            </span>
            <span>{formatIDR(weekendPrice * weekendNights)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm font-medium text-gray-700">
          <span className="underline cursor-pointer hover:text-gray-900">
            Biaya layanan platform (5%)
          </span>
          <span>{formatIDR(serviceFee)}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <span className="text-base font-bold text-gray-900">Total Pembayaran</span>
        <span className="text-lg font-black text-primary">{formatIDR(grandTotal)}</span>
      </div>
    </div>
  );
}
