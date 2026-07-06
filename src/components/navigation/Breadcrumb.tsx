"use client";

import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4 px-4 md:px-0">
      <ol className="flex items-center gap-1.5 text-[13px] overflow-x-auto scrollbar-hide whitespace-nowrap">
        <li>
          <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
            Beranda
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <LuChevronRight size={14} className="text-gray-400" />
            {item.href ? (
              <Link href={item.href} className="text-gray-500 hover:text-gray-900 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
