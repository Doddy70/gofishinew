// ==========================================
// GOFISHI TYPE DEFINITIONS
// Best Practice: Explicit types, Union types, Optional properties
// ==========================================

import { User } from "./user";

// ==========================================
// ENUM TYPES (Union Types)
// ==========================================

export type UserRole = "GUEST" | "HOST" | "ADMIN";
export type HostStatus = "NONE" | "PENDING" | "APPROVED" | "REJECTED";
export type ListingStatus = "PENDING" | "APPROVED" | "REJECTED";
export type BookingType = "PRIVATE" | "SHARING";
export type TripStatus = "SEARCHING" | "CONFIRMED" | "FULL" | "CANCELLED" | "COMPLETED";
export type PaymentStatus = "PENDING" | "HELD" | "RELEASED" | "REFUNDED";
export type RentalType = "WITH_CAPTAIN" | "BAREBOAT" | "BOTH";

// ==========================================
// CORE RELATION TYPES
// ==========================================

export interface CatchGallery {
  id: string;
  listingId: string;
  imageUrl: string;
  caption?: string;
  createdAt: Date | string;
}

export interface Amenity {
  id: string;
  label: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Location {
  id: string;
  label: string;
  value: string;
  country: string;
}

// ==========================================
// USER TYPES
// ==========================================

export interface UserBasic {
  id: string;
  name: string | null;
  image: string | null;
  phoneNumber?: string | null;
}

export interface UserWithRole extends UserBasic {
  email: string;
  role: UserRole;
  hostStatus: HostStatus;
}

// ==========================================
// LISTING TYPES
// ==========================================

export interface Listing {
  id: string;
  slug: string | null;
  title: string;
  description: string;
  imageSrc: string;
  images: string[];
  legalDocs: string[];

  // Booking Settings
  bookingApprovalType: string;
  depositPercentage: number;
  cancellationDays: number;

  // Boat Details
  category: string;
  boatType: string;
  fishingTechs: string[];
  passengerCapacity: number;
  price: number;
  engine1: string | null;
  engine2: string | null;
  facilities: string[];
  tackleTypes: string[];

  // Equipment
  hasLivewell: boolean;
  rodHoldersCount: number;
  hasFishFinder: boolean;
  hasGPS: boolean;
  navigationGear: string | null;
  communicationGear: string | null;

  providesRods: boolean;
  providesBait: boolean;
  providesTackle: boolean;
  hasCoolBox: boolean;
  hasBiminiTop: boolean;
  hasRestroom: boolean;
  hasCabin: boolean;

  captainName: string | null;
  rentalType: RentalType;

  // Location
  locationValue: string;
  latitude: number | null;
  longitude: number | null;

  // Metadata
  status: ListingStatus;
  videoUrl: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;

  // Relations
  user?: UserBasic;
  tripMasters?: TripMaster[];
  reviews?: Review[];
  amenities?: Amenity[];
  catchGalleries?: CatchGallery[];
  reservations?: Reservation[];
  categoryRef?: Category;
  locationRef?: Location;
  addOns?: AddOn[];
  blockedDates?: BlockedDate[];
  rentalPackages?: RentalPackage[];

  // Computed
  avgRating?: number | null;
  reviewCount?: number;
}

// Listing with all details (for detail page)
export interface ListingWithDetails extends Listing {
  avgRating: number | null;
  reviewCount: number;
}

// ==========================================
// TRIP & BOOKING TYPES
// ==========================================

export interface TripMaster {
  id: string;
  listingId: string;
  dateStart: Date | string;
  dateEnd: Date | string;
  bookingType: BookingType;
  priceTotal: number;
  pricePerSeat: number | null;
  minSeats: number;
  maxSeats: number;
  currentSeats: number;
  status: TripStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Reservation {
  id: string;
  tripMasterId: string;
  tripMaster?: TripMaster;
  userId: string;
  user?: UserBasic;
  seatsBooked: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentLink: string | null;
  startDate: Date | string;
  endDate: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewerId: string;
  reviewer?: UserBasic;
  createdAt: Date | string;
}

export interface RentalPackage {
  id: string;
  listingId: string;
  days: number;
  price: number;
  meetingTime: string;
  returnTime: string;
  area: string;
}

export interface AddOn {
  id: string;
  listingId: string;
  name: string;
  price: number;
}

export interface BlockedDate {
  id: string;
  listingId: string;
  startDate: Date | string;
  endDate: Date | string;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
  pagination?: Pagination;
}

export interface ApiError {
  error: string;
  details?: Array<{ field: string; message: string }>;
}

// ==========================================
// FORM TYPES
// ==========================================

export interface CreateListingInput {
  title: string;
  description: string;
  category: string;
  price: number;
  locationValue: string;
  image: File | null;
  legalDoc?: File | null;
  boatType?: string;
  passengerCapacity?: number;
  videoUrl?: string;
}

export interface UpdateListingInput {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  locationValue?: string;
  image?: File | null;
  legalDoc?: File | null;
  boatType?: string;
  passengerCapacity?: number;
  rodHoldersCount?: number;
  videoUrl?: string;
  // Boat features
  hasLivewell?: boolean;
  providesRods?: boolean;
  providesBait?: boolean;
  providesTackle?: boolean;
  hasRestroom?: boolean;
  hasCabin?: boolean;
  hasCoolBox?: boolean;
  hasBiminiTop?: boolean;
  // Pricing
  weekendPrice?: number;
  holidayPrice?: number;
  // Captain
  captainName?: string;
  captainPhone?: string;
  meetingPoint?: string;
}

export interface CheckoutInput {
  listingId: string;
  startDate: string;
  endDate: string;
  bookingType: BookingType;
  slotType?: "MORNING" | "AFTERNOON" | "FULL_DAY";
  seats?: number;
}
