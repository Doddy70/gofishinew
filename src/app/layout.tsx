import { Suspense } from "react";
import {ClerkProvider} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../../design-system/tokens.css";

import { Toaster } from "react-hot-toast";
import CreateListingModal from "@/modals/CreateListingModal";
import EditListingModal from "@/modals/EditListingModal";
import FilterModal from "@/modals/FilterModal";
import LayoutWrapper from "./LayoutWrapper";

const inter = Inter({
  variable:"--font-inter",
  subsets:["latin"],
  weight:["300","400","500","600","700"]
})

export const metadata: Metadata = {
  title: "GoFishi - Sewa Perahu Mancing",
  description: "Marketplace Sewa Perahu dan Pemancingan",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          async
          defer
        ></script>
      </head>
      <body
        className={`${inter.className} antialiased`}
      >
        <ClerkProvider
          signInFallbackRedirectUrl="/"
          signUpFallbackRedirectUrl="/"
          afterSignOutUrl="/"
        >
          <LayoutWrapper>
          {children}
          </LayoutWrapper>

          <Toaster/>
          <CreateListingModal/>
          <EditListingModal/>
          <Suspense fallback={null}>
            <FilterModal/>
          </Suspense>
        </ClerkProvider>
      </body>
    </html>
  );
}