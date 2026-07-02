"use client";

import Image from "next/image";
import Logo from "./Logo";
import { LuMenu, LuGlobe } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { useAuthModal } from "@/store/useAuthModalStore";
import { authClient } from "@/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { useCreateListingModal } from "@/store/useCreateListingModal";
import HeroSearch from "../home/HeroSearch";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const { openRegister, openLogin } = useAuthModal();
  const { open: openCreateListing } = useCreateListingModal();
  const router = useRouter();
  const pathname = usePathname();
  const isMainPage = pathname === "/";

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
    <nav className={`fixed top-0 z-50 w-full bg-canvas transition-all duration-200 border-b border-hairline-soft ${isMainPage ? 'h-[160px]' : 'h-[80px]'}`}>
      <div className="mx-auto max-w-[2520px] px-2 sm:px-4 md:px-10 xl:px-20 h-[80px] flex items-center justify-between">
        
        {/* Left Navbar Logo */}
        <div className="flex-1 flex items-center justify-start">
          <Logo />
        </div>

        {/* Center Space */}
        <div className="flex-1 flex items-center justify-center relative">
        </div>

        {/* Right Navbar User Menu */}
        <div className="flex-1 flex items-center justify-end gap-1 relative z-50" ref={menuRef}>
          <div className="hidden md:flex items-center gap-1">
            <button onClick={openCreateListing} className="text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-surface-soft transition text-ink">
              Daftarkan Perahu
            </button>
            <button className="p-3 rounded-full hover:bg-surface-soft transition text-ink">
              <LuGlobe size={18} />
            </button>
          </div>

          <button onClick={() => setOpen((prev) => !prev)} className="flex items-center gap-3 border border-hairline rounded-full pl-3 pr-2 py-1.5 hover:shadow-[var(--shadow-hover)] transition-shadow cursor-pointer bg-canvas outline-none ml-2">
            <LuMenu size={18} className="text-ink" />
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
            <div className="absolute right-0 top-[52px] w-[240px] bg-canvas border border-transparent rounded-xl shadow-[var(--shadow-card)] overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <ul className="text-ink text-[14px] font-medium text-left">
                {session ? (
                  <>
                    <li className="px-4 py-3 hover:bg-surface-soft cursor-pointer font-semibold" onClick={() => { setOpen(false); router.push("/reservations"); }}>Trip Saya</li>
                    <li className="px-4 py-3 hover:bg-surface-soft cursor-pointer font-semibold" onClick={() => { setOpen(false); router.push("/favorites"); }}>Favorit</li>
                    <div className="h-px bg-hairline my-2 opacity-50" />
                    <li className="px-4 py-3 hover:bg-surface-soft cursor-pointer" onClick={() => { setOpen(false); openCreateListing(); }}>Daftarkan Perahu</li>
                    <li className="px-4 py-3 hover:bg-surface-soft cursor-pointer" onClick={() => { setOpen(false); router.push("/dashboard"); }}>Kapten pengalaman</li>
                    <li className="px-4 py-3 hover:bg-surface-soft cursor-pointer" onClick={() => setOpen(false)}>Akun</li>
                    {(session as any).user.role === "ADMIN" && (
                      <>
                        <div className="h-px bg-hairline my-2 opacity-50" />
                        <li className="px-4 py-3 hover:bg-surface-soft cursor-pointer text-blue-600 font-semibold" onClick={() => { setOpen(false); router.push("/admin"); }}>Panel Admin</li>
                      </>
                    )}
                    <div className="h-px bg-hairline my-2 opacity-50" />
                    <li onClick={handleLogout} className="px-4 py-3 hover:bg-surface-soft cursor-pointer">Keluar</li>
                  </>
                ) : (
                  <>
                    <li onClick={() => { openRegister(); setOpen(false); }} className="px-4 py-3 hover:bg-surface-soft cursor-pointer font-semibold">Daftar</li>
                    <li onClick={() => { openLogin(); setOpen(false); }} className="px-4 py-3 hover:bg-surface-soft cursor-pointer">Masuk</li>
                    <div className="h-px bg-hairline my-2 opacity-50" />
                    <li className="px-4 py-3 hover:bg-surface-soft cursor-pointer" onClick={() => { setOpen(false); openCreateListing(); }}>Daftarkan Perahu</li>
                    <li className="px-4 py-3 hover:bg-surface-soft cursor-pointer">Pusat Bantuan</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Expanded Functional HeroSearch Component */}
      {isMainPage && (
        <div className="w-full flex justify-center absolute top-[80px]">
          <HeroSearch />
        </div>
      )}
    </nav>
  );
}
