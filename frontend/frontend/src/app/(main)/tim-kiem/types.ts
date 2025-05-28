import { Villa } from "@/services/villa.service";

export interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface SearchVilla extends Villa {
  amenities?: {
    general: { name: string; available: boolean }[];
    kitchen: { name: string; available: boolean }[];
    common: { name: string; available: boolean }[];
    room: { name: string; available: boolean }[];
    bathroom: { name: string; available: boolean }[];
  };
  isAvailable?: boolean;
  reviews?: Review[];
} 