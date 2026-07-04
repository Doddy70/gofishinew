"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuShip, LuUsers, LuLayoutDashboard, LuSettings, LuCheck, LuCalendar, LuAnchor, LuDollarSign } from "react-icons/lu";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: "ADMIN" | "HOST";
}

export default function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: LuLayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: role === "ADMIN" ? "Kelola Semua Kapal" : "Kapal Saya",
      icon: LuShip,
      href: role === "ADMIN" ? "/admin/listings" : "/properties",
      active: pathname === "/admin/listings" || pathname === "/properties",
    },
    {
      label: "Reservasi Saya",
      icon: LuCalendar,
      href: "/dashboard/reservations",
      active: pathname === "/dashboard/reservations",
    },
    {
      label: "Kalender & Jadwal",
      icon: LuCalendar,
      href: "/dashboard/calendar",
      active: pathname === "/dashboard/calendar",
    },
    {
      label: "Fishing Log (Gacor)",
      icon: LuShip,
      href: "/dashboard/fishing-log",
      active: pathname === "/dashboard/fishing-log",
    },
    ...(role === "ADMIN" ? [
      {
        label: "Taksonomi & Lokasi",
        icon: LuAnchor,
        href: "/admin/taxonomy",
        active: pathname === "/admin/taxonomy",
      },
      {
        label: "Verifikasi Kapten",
        icon: LuCheck,
        href: "/admin/verification",
        active: pathname === "/admin/verification",
      },
      {
        label: "Keuangan & Komisi",
        icon: LuDollarSign,
        href: "/admin/finance",
        active: pathname === "/admin/finance",
      },
      {
        label: "Kelola Pengguna",
        icon: LuUsers,
        href: "/admin/users",
        active: pathname === "/admin/users",
      },
    ] : []),
  ];

  return (
    <aside className="w-64 bg-canvas border-r border-default min-h-[calc(100vh-6rem)] hidden md:block">
      <div className="flex flex-col gap-2 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
              route.active 
                ? "bg-primary/10 text-primary" 
                : "text-muted hover:bg-muted"
            )}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
