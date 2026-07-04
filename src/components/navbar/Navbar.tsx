"use client";

import Image from "next/image";
import Logo from "./Logo";
import NavbarWeatherWidget from "./NavbarWeatherWidget";
import NotificationBell from "../notifications/NotificationBell";
import { LuMenu, LuGlobe, LuX, LuUser, LuSettings, LuLogOut, LuShield, LuChevronDown } from "react-icons/lu";
import { useEffect, useRef, useState, Suspense } from "react";
import { useAuthModal } from "@/store/useAuthModalStore";
import { useCreateListingModal } from "@/store/useCreateListingModal";
import HeroSearch from "../home/HeroSearch";
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
  const router = useRouter();
  const pathname = usePathname();
  const isMainPage = pathname === "/";

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 20) {
        setIsScrolled(false);
        setIsSearchExpanded(false);
      } else if (currentScrollY > lastScrollY) {
        setIsScrolled(true);
        setIsSearchExpanded(false);
      } else if (currentScrollY < lastScrollY - 10) {
        setIsScrolled(false);
        setIsSearchExpanded(false);
      }
      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
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

  const isExpandedState = (!isScrolled && isMainPage) || isSearchExpanded;
  const navHeight = isExpandedState ? "h-[160px] md:h-[180px]" : "h-[80px]";

  return (
    <>
      <nav className={`fixed top-0 z-50 w-full bg-canvas transition-all duration-300 border-b border-hairline-soft ${navHeight}`}>
        <div className="mx-auto max-w-[2520px] px-4 md:px-10 xl:px-20 h-[80px] flex items-center justify-between">

          {/* Left - Logo */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => router.push("/?search=true")}
              className="lg:hidden p-3 rounded-full hover:bg-surface-soft transition text-ink"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-1">
              {/* Globe Icon - Language selector (placeholder) */}
              <button className="p-3 rounded-full hover:bg-surface-soft transition text-ink" title="Bahasa">
                <LuGlobe size={18} />
              </button>

              {isSignedIn && <NotificationBell />}
            </div>

              {/* User Menu Button */}
            <div className="relative" ref={userMenuRef}>
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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-3 rounded-full hover:bg-surface-soft transition text-ink"
            >
              {mobileMenuOpen ? <LuX size={20} /> : <LuMenu size={20} />}
            </button>
          </div>
        </div>

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
