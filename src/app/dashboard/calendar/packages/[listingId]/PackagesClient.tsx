"use client";

import { useState } from "react";

interface Listing {
  id: string;
  title: string;
  rentalPackages: any[];
}

export default function PackagesClient({ listing }: { listing: Listing }) {
  const [packages, setPackages] = useState(listing.rentalPackages || []);

  return (
    <div>
      <p className="text-gray-600">Pengaturan paket untuk {listing.title}</p>
    </div>
  );
}
