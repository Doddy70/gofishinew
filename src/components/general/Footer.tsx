"use client";

import Link from "next/link";
import { FaYoutube, FaFacebookSquare, FaInstagram } from "react-icons/fa";

export default function Footer() {
  // ⚠️ Potential hydration mismatch if server/client timezone differs
  // Solution: Use static year or suppress hydration warning
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 bg-white py-8 mt-10">
      <div className="max-w-screen-xl mx-auto px-4 md:px-20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-gray-500 text-sm" suppressHydrationWarning>
          © {currentYear} GoFishi. All rights reserved.
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="https://www.youtube.com/@GofishiChannel" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-primary transition">
            <FaYoutube size={24} />
          </Link>
          <Link href="https://www.facebook.com/gofishichannel/?locale=eo_EO" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-primary transition">
            <FaFacebookSquare size={24} />
          </Link>
          <Link href="https://www.instagram.com/gofishi/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-primary transition">
            <FaInstagram size={24} />
          </Link>
          <Link href="https://www.threads.com/@gofishi" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-primary font-semibold text-lg transition">
            @
          </Link>
        </div>
      </div>
    </footer>
  );
}
