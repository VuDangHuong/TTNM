"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon, UserIcon, HomeIcon } from "@heroicons/react/24/solid";
import { MapPinIcon, TagIcon, HeartIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
import { calculateDiscountedPrice } from "@/components/villa-detail/utils/price-utils";
import type { Villa } from "@/services/villa.service";

interface Discount {
  _id: string;
  name: string;
  isActive: boolean;
  type: "percentage" | "fixed";
  value: number;
  startDate: string;
  endDate: string;
}

interface VillaListingGridProps {
  initialVillas: Villa[];
}

const VillaListingGrid = ({ initialVillas }: VillaListingGridProps) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});
  const [visibleItems, setVisibleItems] = useState(6);
  const [activeFilter, setActiveFilter] = useState("all");

  // Load more villas
  const loadMore = () => {
    const newVisibleItems = visibleItems + 3;
    setVisibleItems(newVisibleItems);
  };

  // Toggle favorite status
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Set hover state
  const setHover = (id: string, isHovered: boolean) => {
    setHoverStates(prev => ({
      ...prev,
      [id]: isHovered
    }));
  };

  // Calculate average rating from reviews
  const getAverageRating = (reviews?: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / reviews.length).toFixed(1));
  };

  // Format price to VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ/đêm';
  };

  // Check if a discount is currently active
  const hasActiveDiscount = (discounts?: Discount[]) => {
    if (!discounts || discounts.length === 0) return false;
    
    const now = new Date();
    return discounts.some(
      d => d.isActive && 
           new Date(d.startDate) <= now && 
           new Date(d.endDate) >= now
    );
  };

  // Get discounted price
  const getDiscountedPrice = (villa: Villa) => {
    if (!villa.discounts || !hasActiveDiscount(villa.discounts)) {
      return villa.basePrice;
    }
    
    return calculateDiscountedPrice(villa.basePrice, villa.discounts, new Date());
  };

  // Get discount percentage
  const getDiscountPercentage = (villa: Villa) => {
    if (!villa.discounts) return 0;
    
    const activeDiscounts = villa.discounts.filter(
      d => d.isActive && 
           new Date(d.startDate) <= new Date() && 
           new Date(d.endDate) >= new Date() &&
           d.type === "percentage"
    );
    
    if (activeDiscounts.length === 0) return 0;
    
    return Math.max(...activeDiscounts.map(d => d.value));
  };

  // Render star ratings
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        <div className="flex items-center mr-1">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <StarIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating) ? "text-amber-400" : "text-gray-300"
                }`}
              />
            ))}
        </div>
        <span className="text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Handle image error
  const handleImageError = (villaId: string) => {
    setImageErrors(prev => ({
      ...prev,
      [villaId]: true
    }));
  };

  // Get the first valid image or a fallback
  const getVillaImage = (villa: Villa) => {
    if (imageErrors[villa._id]) {
      return 'https://placehold.co/1280x1024?text=Villa+Image';
    }
    
    if (!villa.images || villa.images.length === 0) {
      return 'https://placehold.co/1280x1024?text=Villa+Image';
    }
    
    return villa.images[0];
  };

  // Filter villas based on active filter
  const filteredVillas = initialVillas.filter(villa => {
    if (activeFilter === "all") return true;
    if (activeFilter === "discounted") return hasActiveDiscount(villa.discounts);
    if (activeFilter === "luxury") return villa.basePrice > 5000000; // Assuming luxury is >5M VND
    if (activeFilter === "family") return villa.maxGuests >= 6;
    return true;
  });

  // Get visible villas
  const visibleVillas = filteredVillas.slice(0, visibleItems);
  const hasMore = visibleItems < filteredVillas.length;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Khám phá Villa hoàn hảo
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Lựa chọn biệt thự sang trọng với tiện nghi đầy đủ cho kỳ nghỉ đáng nhớ của bạn. Mỗi villa đều mang đến trải nghiệm độc đáo.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button 
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "all" 
                ? "bg-blue-600 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Tất cả
          </button>
          <button 
            onClick={() => setActiveFilter("discounted")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "discounted" 
                ? "bg-blue-600 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Đang giảm giá
          </button>
          <button 
            onClick={() => setActiveFilter("luxury")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "luxury" 
                ? "bg-blue-600 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Villa cao cấp
          </button>
          <button 
            onClick={() => setActiveFilter("family")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === "family" 
                ? "bg-blue-600 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Dành cho gia đình
          </button>
        </div>

        {filteredVillas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="mb-4 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Không tìm thấy villa nào</h3>
            <p className="text-gray-600 mb-6">Vui lòng thử lại với bộ lọc khác hoặc quay lại sau</p>
            <button 
              onClick={() => setActiveFilter("all")}
              className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Xem tất cả villa
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleVillas.map((villa) => {
                const discountedPrice = getDiscountedPrice(villa);
                const hasDiscount = discountedPrice < villa.basePrice;
                const discountPercentage = getDiscountPercentage(villa);
                const isHovered = hoverStates[villa._id] || false;
                const isFavorite = favorites[villa._id] || false;
                const avgRating = getAverageRating(villa.reviews);
                
                return (
                  <Link
                    href={`/villa/${villa.slug}`}
                    key={villa._id}
                    className="group"
                    onMouseEnter={() => setHover(villa._id, true)}
                    onMouseLeave={() => setHover(villa._id, false)}
                  >
                    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                      {/* Villa Image with overlay actions */}
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={getVillaImage(villa)}
                          alt={villa.name}
                          fill
                          className={`object-cover transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          onError={() => handleImageError(villa._id)}
                          priority={false}
                          unoptimized={true}
                        />
                        
                        {/* Favorite button */}
                        <button 
                          onClick={(e) => toggleFavorite(villa._id, e)}
                          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
                            isFavorite 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white/80 text-gray-600 hover:bg-white'
                          }`}
                          aria-label={isFavorite ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                        >
                          <HeartIcon 
                            className={`h-5 w-5 ${isFavorite ? 'fill-white' : ''}`} 
                          />
                        </button>
                        
                        {/* Quick view button - appears on hover */}
                        <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 ${
                          isHovered ? 'opacity-100' : 'opacity-0'
                        }`}>
                          <div className="transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                            <span className="bg-white/90 text-gray-800 px-4 py-2 rounded-full font-medium text-sm flex items-center">
                              <ArrowsPointingOutIcon className="h-4 w-4 mr-1" />
                              Xem chi tiết
                            </span>
                          </div>
                        </div>
                        
                        {/* Discount badge */}
                        {discountPercentage > 0 && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                            -{discountPercentage}%
                          </div>
                        )}
                      </div>

                      {/* Villa Details */}
                      <div className="p-5 flex-grow flex flex-col">
                        {/* Title and Rating */}
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                            {villa.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            {renderStars(avgRating)}
                            <span className="text-xs text-gray-500">
                              {villa.reviews?.length || 0} đánh giá
                            </span>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-start mb-2">
                          <MapPinIcon className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {villa.location?.address || 'Địa chỉ đang cập nhật'}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {/* Area */}
                          <div className="flex items-center">
                            <HomeIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <p className="text-sm text-gray-600">{`${villa.size} m²`}</p>
                          </div>

                          {/* Capacity */}
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <p className="text-sm text-gray-600">{`${villa.maxGuests} người`}</p>
                          </div>
                        </div>

                        {/* Active Promotion - if applicable */}
                        {hasDiscount && (
                          <div className="flex items-center mb-3 text-red-600">
                            <TagIcon className="h-5 w-5 mr-2 flex-shrink-0" />
                            <p className="text-sm font-medium">Ưu đãi đặc biệt</p>
                          </div>
                        )}

                        {/* Price section - at the bottom */}
                        <div className="mt-auto pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              {hasDiscount ? (
                                <div className="flex flex-col">
                                  <span className="text-lg font-bold text-red-600">{formatPrice(discountedPrice)}</span>
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(villa.basePrice)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-lg font-bold text-blue-600">{formatPrice(villa.basePrice)}</span>
                              )}
                            </div>
                            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                              Đặt ngay
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Load more button */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMore}
                  className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 bg-white rounded-full hover:bg-blue-50 transition-colors duration-200 font-medium"
                >
                  Xem thêm Villa
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default VillaListingGrid;
