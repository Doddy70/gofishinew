import type { Metadata } from "next";
import {  Poppins } from "next/font/google";
import "./globals.css";
import "../../design-system/tokens.css";
import RegisterModal from "@/modals/RegisterModal";
import LoginModal from "@/modals/LoginModal";
import { Toaster } from "react-hot-toast";
import CreateListingModal from "@/modals/CreateListingModal";
import EditListingModal from "@/modals/EditListingModal";
import FilterModal from "@/modals/FilterModal";
import LayoutWrapper from "./LayoutWrapper";

const poppins = Poppins({
  variable:"--font-poppins",
  subsets:["latin"],
  weight:["300","400","500","600","700"]
})

export const metadata: Metadata = {
  title: "GoFishi - Sewa Perahu Mancing",
  description: "Marketplace Sewa Perahu dan Pemancingan",
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
        className={`${poppins.className} antialiased`}
      >
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
        <RegisterModal/>
        <LoginModal/>
        <Toaster/>
        <CreateListingModal/>
        <EditListingModal/>
        <FilterModal/>
      </body>
    </html>
  );
}
