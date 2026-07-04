import React from "react";

interface CheckoutPriceBreakdownProps {
  nights: number;
  baseNights: number;
  weekendNights: number;
  pricePerNight: number;
  weekendPrice?: number | null;
  total: number;
}

export default function CheckoutPriceBreakdown({
  nights,
  baseNights,
  weekendNights,
  pricePerNight,
  weekendPrice,
  total,
}: CheckoutPriceBreakdownProps) {
  if (nights <= 0) return null;

  return (
    <div className="space-y-3 mb-6 bg-transparent">
      {baseNights > 0 && (
        <div className="flex justify-between text-ink text-[16px]">
          <span className="underline cursor-pointer">
            Rp {pricePerNight.toLocaleString('id-ID')} x {baseNights} hari
          </span>
          <span>Rp {(pricePerNight * baseNights).toLocaleString('id-ID')}</span>
        </div>
      )}
      
      {weekendNights > 0 && weekendPrice && (
        <div className="flex justify-between text-ink text-[16px]">
          <span className="underline cursor-pointer">
            Biaya Akhir Pekan (Rp {weekendPrice.toLocaleString('id-ID')} x {weekendNights} hari)
          </span>
          <span>Rp {(weekendPrice * weekendNights).toLocaleString('id-ID')}</span>
        </div>
      )}

      <div className="border-t border-hairline mt-4 pt-4 flex justify-between font-bold text-[16px] text-ink">
        <span>Total Estimasi</span>
        <span>Rp {total.toLocaleString('id-ID')}</span>
      </div>
    </div>
  );
}
