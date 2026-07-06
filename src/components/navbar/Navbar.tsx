"use client";

import Image from "next/image";
import Logo from "./Logo";
import NavbarWeatherWidget from "./NavbarWeatherWidget";
import NotificationBell from "../notifications/NotificationBell";
import { LuMenu, LuGlobe, LuX, LuUser, LuSettings, LuLogOut, LuShield, LuChevronDown, LuSearch, LuChevronLeft, LuSlidersHorizontal } from "react-icons/lu";
import { useEffect, useRef, useState, Suspense } from "react";
import { useAuthModal } from "@/store/useAuthModalStore";
import { useCreateListingModal } from "@/store/useCreateListingModal";
import { useFilterModal } from "@/store/useFilterListingModal";
import HeroSearch from "../home/HeroSearch";
import RouteTabs from "../home/RouteTabs";
import FilterPills from "../search/FilterPills";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

function HeroSearchWrapper({ isScrolled, isExpanded, onExpand }: { isScrolled: boolean; isExpanded: boolean; onExpand: () => void }) {
  return (
    <Suspense fallback={null}>
      <HeroSearch isScrolled={isScrolled} isExpanded={isExpanded} onExpand={onExpand} />
    </Suspense>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}

function NavLink({ href, children, onClick, active }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${(active || isActive)
          ? "bg-primary/10 text-primary font-semibold"
          : "text-ink hover:bg-surface-soft"
        }
      `}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { isSignedIn, userId } = useAuth();
  const { open: openCreateListing } = useCreateListingModal();
  const { open: openFilterModal } = useFilterModal();
  const router = useRouter();
  const pathname = usePathname();
  const isMainPage = pathname === "/" || pathname === "/perahu";

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Shadow and search expansion logic
      if (currentScrollY <= 20) {
        setIsScrolled(false);
        setIsSearchExpanded(false);
      } else {
        setIsScrolled(true);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigation = (href: string) => {
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push(href);
  };

  const getMobileNavConfig = () => {
    if (pathname === "/") return null;
    
    // Perahu routes
    if (pathname.startsWith("/perahu/")) return { backUrl: "/perahu", title: "Detail Perahu" };
    if (pathname === "/perahu") return { backUrl: "/", title: "Jelajahi" };
    
    // Checkout routes
    if (pathname.startsWith("/checkout")) return { backUrl: "back", title: "Checkout" };

    // Dashboard routes
    if (pathname === "/dashboard") return { backUrl: "/", title: "Dashboard Kapten" };
    if (pathname.startsWith("/dashboard/")) return { backUrl: "/dashboard", title: "Dashboard" };

    // Reservations routes
    if (pathname === "/reservations") return { backUrl: "/", title: "Trip Saya" };
    if (pathname.startsWith("/reservations/")) return { backUrl: "/reservations", title: "Detail Trip" };

    // Favorites
    if (pathname === "/favorites") return { backUrl: "/", title: "Favorit" };

    // Listings (Detail) routes
    if (pathname.startsWith("/listings/")) return { backUrl: "/", title: "Detail Perahu" };

    // Default fallback
    return { backUrl: "/", title: "Kembali" };
  };

  const mobileNav = getMobileNavConfig();

  const isExpandedState = (!isScrolled && isMainPage) || isSearchExpanded;
  
  // On mobile, if we have categories, we need more height.
  // We can let the height be auto, or set specific heights.
  // 80px top bar + ~70px category list = 150px on mobile for main page
  const navHeight = isExpandedState 
    ? "h-[140px] md:h-[180px]" 
    : isMainPage 
  const navHeightClass = isMainPage 
    ? (pathname === "/" ? "h-[80px]" : (isExpandedState ? "h-[140px] md:h-[180px]" : "h-[140px] md:h-[150px]")) 
    : "h-[80px]";

  return (
    <>
      <nav className={`fixed top-0 z-50 w-full bg-canvas transition-all duration-300 ease-in-out border-b flex flex-col ${pathname === "/" ? "h-auto md:h-[80px]" : (isMainPage ? (isExpandedState ? 'h-auto md:h-[180px]' : 'h-auto md:h-[150px]') : 'h-[80px]')} ${isScrolled ? 'border-hairline shadow-sm' : 'border-hairline-soft'}`}>
        <div className="mx-auto w-full max-w-[2520px] px-4 md:px-10 xl:px-20 h-[80px] shrink-0 flex items-center justify-between">

          {/* Left - Logo */}
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-2">
              <Logo />
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              <NavLink href="/">Beranda</NavLink>
              <NavLink href="/perahu">Jelajahi</NavLink>
              {isSignedIn && (
                <>
                  <NavLink href="/dashboard">Dashboard</NavLink>
                  <NavLink href="/reservations">Trip Saya</NavLink>
                </>
              )}
            </div>
          </div>

          {/* Center - Search or Weather */}
          <div className="hidden xl:flex items-center justify-center flex-1 px-8">
            {isMainPage && !isScrolled ? <NavbarWeatherWidget /> : null}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center justify-center gap-2 w-full md:w-auto md:justify-end">
          
          {/* Mobile View */}
          <div className="md:hidden w-full px-2 flex justify-center">
            {mobileNav ? (
              pathname === "/perahu" ? (
                <div className="flex items-center w-full gap-2 h-[48px]">
                  <button
                    onClick={() => router.push("/")}
                    className="p-2 -ml-2 rounded-full hover:bg-surface-soft transition active:scale-95 shrink-0"
                  >
                    <LuChevronLeft size={24} className="text-ink" />
                  </button>
                  <button 
                    onClick={() => router.push("/?search=true")}
                    className="flex-1 flex flex-col justify-center bg-white border border-gray-200 rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.08)] py-1.5 px-4 min-w-0 hover:shadow-md transition-shadow"
                  >
                    <span className="text-[13px] font-bold text-gray-900 leading-tight truncate w-full text-center">Jelajahi Armada</span>
                    <span className="text-[11px] font-medium text-gray-500 leading-tight truncate w-full text-center">Kapan pun • Tambahkan tamu</span>
                  </button>
                  <button
                    onClick={() => openFilterModal()}
                    className="p-2.5 bg-white border border-gray-200 rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:shadow-md transition-shadow shrink-0 flex items-center justify-center"
                  >
                    <LuSlidersHorizontal size={18} className="text-gray-900" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center w-full relative h-[48px]">
                  <button
                    onClick={() => mobileNav.backUrl === "back" ? router.back() : router.push(mobileNav.backUrl)}
                    className="p-2 -ml-2 rounded-full hover:bg-surface-soft transition active:scale-95 absolute left-0 z-10"
                  >
                    <LuChevronLeft size={24} className="text-ink" />
                  </button>
                  <div className="w-full text-center px-10 truncate">
                    <span className="text-[16px] font-semibold text-ink">{mobileNav.title}</span>
                  </div>
                </div>
              )
            ) : (
              <div className="w-full flex items-center gap-2 max-w-[360px]">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-3 bg-white border border-gray-200 rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:shadow-md transition-shadow shrink-0"
                >
                  <LuMenu size={20} className="text-gray-900" />
                </button>
                <button
                  onClick={() => router.push("/?search=true")}
                  className="flex-1 flex items-center bg-white border border-gray-200 rounded-full shadow-[0_3px_10px_rgba(0,0,0,0.08)] py-3 px-5 gap-4 hover:shadow-md transition-shadow"
                >
                  <LuSearch size={20} className="text-gray-900 shrink-0" strokeWidth={2.5} />
                  <div className="flex flex-col items-start justify-center flex-1 overflow-hidden">
                    <span className="text-[14px] font-bold text-gray-900 leading-tight truncate w-full text-left">Mulai pencarian</span>
                    <span className="text-[12px] font-medium text-gray-500 leading-tight truncate w-full text-left">Kapan pun • Tambahkan tamu</span>
                  </div>
                </button>
              </div>
            )}
          </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-1">
              {/* Globe Icon - Language selector (placeholder) */}
              <button className="p-3 rounded-full hover:bg-surface-soft transition text-ink" title="Bahasa">
                <LuGlobe size={18} />
              </button>

              {isSignedIn && <NotificationBell />}
            </div>

              {/* User Menu Button */}
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`
                  flex items-center gap-2 border border-hairline rounded-full pl-3 pr-1 py-1
                  hover:shadow-[var(--shadow-hover)] transition-all duration-200
                  ${userMenuOpen ? "shadow-md bg-surface-soft" : "bg-canvas"}
                `}
              >
                <LuMenu size={18} className="text-ink ml-1" />
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-400 border border-hairline-soft ml-1 relative">
                  {isSignedIn ? (
                    <UserButton /* @ts-ignore */
            afterSignOutUrl="/" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <LuUser size={20} className="mt-1" />
                    </div>
                  )}
                </div>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 top-[110%] w-[250px] bg-canvas border border-hairline rounded-xl shadow-[0_2px_16px_rgba(0,0,0,0.12)] py-2 z-50">
                  
                  {!isSignedIn ? (
                    <>
                      {/* Signed Out Menu */}
                      <SignInButton mode="modal">
                        <button 
                          className="w-full text-left px-4 py-3 text-[14px] font-semibold text-ink hover:bg-surface-soft transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Masuk atau mendaftar
                        </button>
                      </SignInButton>
                      
                      <div className="w-full h-[1px] bg-hairline my-1"></div>
                      
                      <button 
                        onClick={() => { setUserMenuOpen(false); openCreateListing(); }}
                        className="w-full text-left px-4 py-3 text-[14px] font-medium text-ink hover:bg-surface-soft transition-colors"
                      >
                        Daftarkan Perahu
                      </button>
                      
                      <button 
                        className="w-full text-left px-4 py-3 text-[14px] font-medium text-ink hover:bg-surface-soft transition-colors"
                      >
                        Pusat Bantuan
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Signed In Menu */}
                      <button 
                        onClick={() => handleNavigation("/reservations")}
                        className="w-full text-left px-4 py-3 text-[14px] font-semibold text-ink hover:bg-surface-soft transition-colors"
                      >
                        Trip Saya
                      </button>
                      <button 
                        onClick={() => handleNavigation("/favorites")}
                        className="w-full text-left px-4 py-3 text-[14px] font-semibold text-ink hover:bg-surface-soft transition-colors"
                      >
                        Favorit
                      </button>
                      
                      <div className="w-full h-[1px] bg-hairline my-1"></div>
                      
                      <button 
                        onClick={() => { setUserMenuOpen(false); openCreateListing(); }}
                        className="w-full text-left px-4 py-3 text-[14px] font-medium text-ink hover:bg-surface-soft transition-colors"
                      >
                        Daftarkan Perahu
                      </button>
                      <button 
                        onClick={() => handleNavigation("/dashboard")}
                        className="w-full text-left px-4 py-3 text-[14px] font-medium text-ink hover:bg-surface-soft transition-colors"
                      >
                        Dashboard Kapten
                      </button>
                      <button 
                        onClick={() => handleNavigation("/settings")}
                        className="w-full text-left px-4 py-3 text-[14px] font-medium text-ink hover:bg-surface-soft transition-colors"
                      >
                        Pengaturan
                      </button>
                      
                      <div className="w-full h-[1px] bg-hairline my-1"></div>
                      
                      <button 
                        className="w-full text-left px-4 py-3 text-[14px] font-medium text-ink hover:bg-surface-soft transition-colors"
                      >
                        Pusat Bantuan
                      </button>
                      
                      {/* Clerk Sign Out is normally handled by UserButton, but we can have a link if we want, or rely on UserButton. 
                          Since we use UserButton inside the hamburger for Clerk, we can leave the explicit logout out, 
                          or implement it using useClerk().signOut(). For now, UserButton handles it. */}
                    </>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Categories / Filters - Mobile and Desktop (Hidden on Homepage Desktop) */}
        {isMainPage && (
          <div className={`w-full bg-canvas transition-all duration-300 overflow-hidden ${
            pathname === "/" ? "md:hidden" : ""
          } ${
            isExpandedState && !isScrolled ? 'h-auto opacity-100 md:opacity-0 md:pointer-events-none' : 'h-auto opacity-100 md:h-[60px] md:opacity-100'
          }`}>
            <div className="mx-auto w-full max-w-[2520px] px-4 md:px-10 xl:px-20 h-full flex items-end">
              <Suspense fallback={null}>
                {pathname === "/perahu" ? <FilterPills /> : <RouteTabs isScrolled={isScrolled} />}
              </Suspense>
            </div>
          </div>
        )}

        {/* Hero Search Area */}
        <div className={`absolute left-0 right-0 hidden md:flex justify-center px-4 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-40 ${
          !isExpandedState ? "top-[14px]" : "top-[80px]"
        }`}>
          <HeroSearchWrapper 
            isScrolled={!isExpandedState} 
            isExpanded={isExpandedState}
            onExpand={() => setIsSearchExpanded(true)}
          />
        </div>
        
        {/* Backdrop for Expanded Search */}
        {isSearchExpanded && (
          <div 
            className="fixed inset-0 bg-black/20 z-[-1]" 
            onClick={() => setIsSearchExpanded(false)}
          />
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu Drawer */}
      <div className={`
        fixed top-0 right-0 h-full w-[320px] bg-canvas z-50 transition-transform duration-300 md:hidden
        ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-hairline">
            <Logo />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-surface-soft transition"
            >
              <LuX size={24} />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto py-4">
            {isSignedIn ? (
              <div className="space-y-1 px-2">
                <p className="px-4 py-2 text-xs font-bold text-muted uppercase tracking-wider">Menu</p>

                <button onClick={() => handleNavigation("/")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-soft transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="font-semibold">Beranda</span>
                </button>

                <button onClick={() => handleNavigation("/lokasi")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-soft transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-semibold">Lokasi</span>
                </button>

                <button onClick={() => handleNavigation("/perahu")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-soft transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span className="font-semibold">Jelajahi</span>
                </button>

                <button onClick={() => handleNavigation("/dashboard")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-soft transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <LuShield size={20} className="text-blue-600" />
                  </div>
                  <span className="font-semibold">Dashboard</span>
                </button>

                <button onClick={() => handleNavigation("/reservations")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-soft transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="font-semibold">Trip Saya</span>
                </button>

                <button onClick={() => handleNavigation("/favorites")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-soft transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <span className="font-semibold">Favorit</span>
                </button>

                <div className="h-px bg-hairline my-4" />

                <button
                  onClick={() => { setMobileMenuOpen(false); openCreateListing(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <span className="font-semibold text-primary">Daftarkan Perahu</span>
                </button>
              </div>
            ) : (
              <div className="space-y-1 px-2">
                <p className="px-4 py-2 text-xs font-bold text-muted uppercase tracking-wider">Akun</p>

                <SignInButton mode="modal">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors font-semibold">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Masuk / Daftar
                  </button>
                </SignInButton>

                <div className="h-px bg-hairline my-4" />

                <button onClick={() => handleNavigation("/")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-soft transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="font-semibold">Beranda</span>
                </button>

                <button onClick={() => handleNavigation("/lokasi")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-soft transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-semibold">Lokasi</span>
                </button>

                <button onClick={() => handleNavigation("/perahu")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-soft transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span className="font-semibold">Jelajahi</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Footer */}
          <div className="border-t border-hairline p-4">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-soft transition-colors text-sm text-muted">
              <LuGlobe size={18} />
              <span>Bahasa: Indonesia</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
