import { User } from "./user";

export interface Listing {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageSrc: string;
  images: string[];
  category: string;
  boatType: string;
  passengerCapacity: number;
  price: number;
  locationValue: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  userId: string;
  user?: {
    id: string;
    name: string | null;
    image: string | null;
    phoneNumber?: string | null;
  };
  fishingTechs: string[];
  catchGalleries?: any[];
  rodHoldersCount?: number;
  hasLivewell?: boolean;
  providesRods?: boolean;
  providesBait?: boolean;
  providesTackle?: boolean;
  hasRestroom?: boolean;
  hasCabin?: boolean;
  hasCoolBox?: boolean;
  hasBiminiTop?: boolean;
  engine1?: string | null;
  engine2?: string | null;
  videoUrl?: string | null;
  navigationGear?: string;
  reservations?: any[];
  // Optional fields that may not exist in schema yet
  captainName?: string;
  meetingPoint?: string;
  targetFish?: string[];
  tackleInventory?: string;
  weekendPrice?: number;
  holidayPrice?: number;
}