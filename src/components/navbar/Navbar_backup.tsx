"use client";

import Image from "next/image";
import Logo from "./Logo";
import { LuSearch, LuMenu, LuGlobe } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { useAuthModal } from "@/store/useAuthModalStore";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateListingModal } from "@/store/useCreateListingModal";
import { useFilterModal } from "@/store/useFilterListingModal";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const { openRegister, openLogin } = useAuthModal();
  const { open: openCreateListing } = useCreateListingModal();
  const { open: openFilterModal } = useFilterModal();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh();
  };

  return (
    <nav className="fixed top-0 z-50 w-full h-[80px] md:h-[96px] bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-full mx-auto max-w-[100%] md:w-[95%] xl:w-[92%] px-4 sm:px-6">
        
        {/* Left Navbar Logo */}
        <div className="flex-1 md:flex-initial flex items-center justify-start hidden md:flex">
          <Logo />
        </div>

        {/* Center Search Bar (Airbnb Style Pill) */}
        <div className="flex-1 md:flex-initial flex items-center justify-center">
          <div 
            onClick={openFilterModal} 
            className="flex items-center justify-between md:justify-start gap-2 pl-6 pr-2 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.08)] border border-gray-200 rounded-full cursor-pointer transition-shadow duration-300 w-full md:w-auto"
          >
            <span className="text-sm font-semibold text-gray-900 pr-3 border-r border-gray-300 hidden md:block">
              Ke mana saja
            </span>
            <span className="text-sm font-semibold text-gray-900 px-3 border-r border-gray-300 hidden md:block">
              Kapan saja
            </span>
            
            {/* Mobile View Text */}
            <div className="flex flex-col md:hidden text-left flex-1">
              <span className="text-sm font-semibold text-gray-900">Ke mana saja</span>
              <span className="text-xs text-gray-500 font-light">Kapan saja • Tambahkan tamu</span>
            </div>

            <span className="text-sm text-gray-500 font-light px-3 hidden md:block">
              Tambahkan tamu
            </span>

            <div className="w-8 h-8 rounded-full bg-[#FF385C] flex items-center justify-center text-white shrink-0">
              <LuSearch size={14} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Right Navbar User Menu */}
        <div className="flex-1 md:flex-initial flex items-center justify-end gap-1 relative" ref={menuRef}>
          <div className="hidden md:flex items-center gap-1">
            <button 
              onClick={openCreateListing} 
              className="text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-gray-100 transition text-gray-900"
            >
              Daftarkan Perahu
            </button>
            <button className="p-3 rounded-full hover:bg-gray-100 transition text-gray-900">
              <LuGlobe size={18} />
            </button>
          </div>

          <button 
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-3 border border-gray-300 rounded-full pl-3 pr-2 py-1.5 hover:shadow-md transition-shadow cursor-pointer bg-white outline-none ml-2"
          >
            <LuMenu size={18} className="text-gray-600" />
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-500">
              {session?.user.image ? (
                <Image src={session.user.image} alt="avatar" fill className="object-cover" />
              ) : (
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: '#fff' }}><path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path></svg>
              )}
            </div>
          </button>

          {/* Dropdown Menu */}
          {open && (
            <div className="absolute right-0 top-[52px] w-[240px] bg-white border border-transparent rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.12)] overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <ul className="text-gray-700 text-[14px] font-medium text-left">
                {session ? (
                  <>
                    <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer font-semibold text-gray-900" onClick={() => { setOpen(false); router.push("/reservations"); }}>Trip Saya</li>
                    <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer font-semibold text-gray-900" onClick={() => { setOpen(false); router.push("/favorites"); }}>Favorit</li>
                    <div className="h-px bg-gray-200 my-2" />
                    <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer" onClick={() => { setOpen(false); openCreateListing(); }}>Daftarkan Perahu</li>
                    <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer" onClick={() => { setOpen(false); router.push("/dashboard"); }}>Kapten pengalaman</li>
                    <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer" onClick={() => setOpen(false)}>Akun</li>
                    {(session as any).user.role === "ADMIN" && (
                      <>
                        <div className="h-px bg-gray-200 my-2" />
                        <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-blue-600 font-semibold" onClick={() => { setOpen(false); router.push("/admin"); }}>Panel Admin</li>
                      </>
                    )}
                    <div className="h-px bg-gray-200 my-2" />
                    <li onClick={handleLogout} className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-900">Keluar</li>
                  </>
                ) : (
                  <>
                    <li onClick={() => { openRegister(); setOpen(false); }} className="px-4 py-3 hover:bg-gray-50 cursor-pointer font-semibold text-gray-900">Daftar</li>
                    <li onClick={() => { openLogin(); setOpen(false); }} className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-900">Masuk</li>
                    <div className="h-px bg-gray-200 my-2" />
                    <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-900" onClick={() => { setOpen(false); openCreateListing(); }}>Daftarkan Perahu</li>
                    <li className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-900">Pusat Bantuan</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
