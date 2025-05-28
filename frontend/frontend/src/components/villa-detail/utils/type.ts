export interface Discount {
  _id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface PriceByDay {
  day: string;
  price: string;
}

export interface Amenity {
  name: string;
  available: boolean;
}

export interface Amenities {
  general: Amenity[];
  kitchen: Amenity[];
  common: Amenity[];
  room: Amenity[];
  bathroom: Amenity[];
}

export interface Timing {
  checkIn: string;
  checkOut: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Villa {
  _id: string;
  name: string;
  description: string;
  subDescription: string;
  images: string[];
  basePrice: number;
  size: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  priceByDay: PriceByDay[];
  amenities: Amenities;
  serviceCharge: number;
  timing: Timing;
  location?: Location;
  isAvailable: boolean;
  reviews?: Review[];
  discounts?: Discount[];
  slug: string;
}
