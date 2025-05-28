'use client';

import { useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

// Import components
import ImageGallery from "@/components/villa-detail/ImageGallery";
import VillaHeader from "@/components/villa-detail/VillaHeader";
import VillaDescription from "@/components/villa-detail/VillaDescription";
import AmenitiesSection from "@/components/villa-detail/AmenitiesSection";
import PriceSection from "@/components/villa-detail/PriceSection";
import BookingForm from "@/components/villa-detail/BookingForm";
import ReviewsSection from "@/components/villa-detail/ReviewsSection";
import SimilarVillas from "@/components/villa-detail/SimilarVillas";
import PolicySection from "@/components/villa-detail/PolicySection";
import MobileBookingBar from "@/components/villa-detail/MobileBookingBar";

// Define base Villa interface
interface Villa {
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
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  reviews?: {
    rating: number;
  }[];
  slug: string;
  discounts?: {
    _id: string;
    name: string;
    isActive: boolean;
    type: "percentage" | "fixed";
    value: number;
    startDate: string;
    endDate: string;
  }[];
}

// Define types for amenities
interface Amenity {
  name: string;
  available: boolean;
}

// Define types for amenities sections
interface Amenities {
  general: Amenity[];
  kitchen: Amenity[];
  common: Amenity[];
  room: Amenity[];
  bathroom: Amenity[];
}

// Define type for price by day
interface PriceByDay {
  day: string;
  price: string;
}

// Define type for timing
interface Timing {
  checkIn: string;
  checkOut: string;
}

// Define type for review
interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

// Define type for discount
interface Discount {
  _id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// Extend the Villa interface for our specific needs
export interface ExtendedVilla extends Villa {
  priceByDay: PriceByDay[];
  amenities: Amenities;
  serviceCharge: number;
  timing: Timing;
  isAvailable: boolean;
  reviews?: Review[];
  discounts?: Discount[];
}

interface VillaDetailContentProps {
  villa: ExtendedVilla;
  similarVillas: ExtendedVilla[];
}

export default function VillaDetailContent({ villa: initialVilla, similarVillas }: VillaDetailContentProps) {
  const [villa, setVilla] = useState<ExtendedVilla>(initialVilla);
  const [isSticky, setIsSticky] = useState(false);

  // Handle sticky booking form
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle new review added
  const handleReviewAdded = (newReview: Review) => {
    setVilla((prevVilla: ExtendedVilla) => ({
      ...prevVilla,
      reviews: prevVilla.reviews ? [newReview, ...prevVilla.reviews] : [newReview]
    }));
  };

  return (
    <AuthProvider>
      <div className="bg-white">
        <ImageGallery images={villa.images} villaName={villa.name} />

        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Villa Details */}
            <div className="lg:w-2/3">
              <VillaHeader villa={villa} />
              <VillaDescription description={villa.description} />
              <AmenitiesSection amenities={villa.amenities} />
              <PriceSection villa={villa} />
            </div>

            {/* Right Column - Booking Form */}
            <div className="lg:w-1/3">
              <BookingForm villa={villa} isSticky={isSticky} />
            </div>
          </div>

          {/* Reviews Section */}
          <ReviewsSection
            reviews={villa.reviews || []}
            villaId={villa._id}
            onReviewAdded={handleReviewAdded}
          />

          {/* Similar Villas Section */}
          {similarVillas.length > 0 && (
            <SimilarVillas villas={similarVillas} />
          )}

          {/* Booking Policy Section */}
          <PolicySection villa={villa} />
        </div>

        {/* Mobile Booking Bar */}
        <MobileBookingBar villa={villa} />
      </div>
    </AuthProvider>
  );
}