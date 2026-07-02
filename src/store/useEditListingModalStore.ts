import { create } from "zustand";
import { Listing } from "@/types/listing";

interface EditListingModalStore {
  isOpen: boolean;
  listing: Listing | null;
  open: (listing: Listing) => void;
  close: () => void;
}

export const useEditListingModal = create<EditListingModalStore>((set) => ({
  isOpen: false,
  listing: null,
  open: (listing) => set({ isOpen: true, listing }),
  close: () => set({ isOpen: false, listing: null }),
}));
