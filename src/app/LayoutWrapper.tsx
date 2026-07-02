'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/general/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className='pt-[80px]'>
        {children}
      </div>
      <Footer />
    </>
  );
}
