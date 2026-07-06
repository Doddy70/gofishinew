"use client";

import { usePathname, useRouter } from "next/navigation";
import { LuSearch, LuHeart, LuUser, LuCalendar } from "react-icons/lu";
import { useAuth, SignInButton } from "@clerk/nextjs";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useAuth();

  const navItems = [
    {
      label: "Telusuri",
      icon: LuSearch,
      href: "/perahu",
      isActive: pathname === "/perahu" || pathname === "/",
    },
    {
      label: "Favorit",
      icon: LuHeart,
      href: "/favorites",
      isActive: pathname === "/favorites",
    },
  ];

  if (isSignedIn) {
    navItems.push({
      label: "Trip Saya",
      icon: LuCalendar,
      href: "/reservations",
      isActive: pathname === "/reservations",
    });
    navItems.push({
      label: "Profil",
      icon: LuUser,
      href: "/dashboard",
      isActive: pathname === "/dashboard",
    });
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[65px] bg-white border-t border-gray-200 flex items-center justify-around z-50 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={() => router.push(item.href)}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
            item.isActive ? "text-[#E61E4D]" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <item.icon size={24} className={item.isActive ? "stroke-[2.5px]" : "stroke-[2px]"} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}

      {!isSignedIn && (
        <SignInButton mode="modal">
          <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-gray-900 transition-colors">
            <LuUser size={24} strokeWidth={2} />
            <span className="text-[10px] font-medium">Masuk</span>
          </button>
        </SignInButton>
      )}
    </div>
  );
}
