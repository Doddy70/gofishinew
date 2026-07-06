'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/general/Footer";
import BottomNav from "@/components/navbar/BottomNav";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className='pt-[80px] pb-[65px] md:pb-0'>
        {children}
      </div>
      <BottomNav />
      <Footer />
    </>
  );
}
