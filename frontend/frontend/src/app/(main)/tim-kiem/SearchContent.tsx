'use client';

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon, UserIcon, HomeIcon, TagIcon } from "@heroicons/react/24/solid";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { fakeDataService } from "@/services/fakeData";
import { calculateDiscountedPrice } from "@/components/villa-detail/utils/price-utils";
import { SearchVilla, Review } from "./types";

// Interfaces
interface Discount {
  _id: string;
  name: string;
  isActive: boolean;
  type: "percentage" | "fixed";
  value: number;
  startDate: string;
  endDate: string;
}

interface SearchParams {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  minGuests?: number;
  bedrooms?: number;
}

interface SearchContentProps {
  initialVillas: SearchVilla[];
}

export default function SearchContent({ initialVillas }: SearchContentProps) {
  // State cho form tìm kiếm
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minGuests, setMinGuests] = useState<number | undefined>(undefined);
  const [bedrooms, setBedrooms] = useState<number | undefined>(undefined);
  const [priceRangeValue, setPriceRangeValue] = useState("");

  // State cho kết quả tìm kiếm
  const [villas, setVillas] = useState<SearchVilla[]>(initialVillas);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Utility functions
  const formatPrice = useCallback((price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
  }, []);

  const calculateAverageRating = useCallback((reviews?: Review[]) => {
    if (!reviews || reviews.length === 0) return 5;
    return Math.round((reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length) * 10) / 10;
  }, []);

  const getDiscountedPrice = useCallback((villa: SearchVilla) => {
    if (!villa.discounts) return villa.basePrice;
    const now = new Date();
    return calculateDiscountedPrice(villa.basePrice, villa.discounts, now);
  }, []);

  const getDiscountPercentage = useCallback((villa: SearchVilla) => {
    if (!villa.discounts) return 0;
    const now = new Date();
    const activeDiscounts = villa.discounts.filter(
      d => d.isActive && 
           new Date(d.startDate) <= now && 
           new Date(d.endDate) >= now &&
           d.type === "percentage"
    );
    if (activeDiscounts.length === 0) return 0;
    return Math.max(...activeDiscounts.map(d => d.value));
  }, []);

  // Handlers
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const searchParams: SearchParams = {};
    if (query) searchParams.query = query;
    if (minPrice) searchParams.minPrice = minPrice;
    if (maxPrice) searchParams.maxPrice = maxPrice;
    if (minGuests) searchParams.minGuests = minGuests;
    if (bedrooms) searchParams.bedrooms = bedrooms;

    try {
      const results = await fakeDataService.searchVillas(searchParams);
      setVillas(results as unknown as SearchVilla[]);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error searching villas:", err);
      setError("Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPriceRangeValue(value);
    
    switch (value) {
      case "0-5":
        setMinPrice(0);
        setMaxPrice(5000000);
        break;
      case "5-10":
        setMinPrice(5000000);
        setMaxPrice(10000000);
        break;
      case "10-15":
        setMinPrice(10000000);
        setMaxPrice(15000000);
        break;
      case "15-20":
        setMinPrice(15000000);
        setMaxPrice(20000000);
        break;
      case "20+":
        setMinPrice(20000000);
        setMaxPrice(undefined);
        break;
      default:
        setMinPrice(undefined);
        setMaxPrice(undefined);
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = villas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(villas.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Search Form */}
      <div className="relative">
        {/* Background Image */}
        <div className="relative h-[40vh] md:h-[50vh]">
          <Image
            src="/images/villa-ngoc-xanh.jpg"
            alt="FLC Sầm Sơn"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-12 lg:p-20">
            <div className="text-white max-w-3xl">
              <p className="text-sm md:text-base font-light mb-2">
                Villa FLC Sầm Sơn - Căn Hộ Nghỉ Dưỡng
              </p>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">Tìm kiếm</h1>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-[#f1f0ec] py-6">
          <div className="container mx-auto px-4">
            <form
              onSubmit={handleSearch}
              className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-3"
            >
              {/* Location/Query Input */}
              <div className="w-full md:w-[30%]">
                <input
                  type="text"
                  className="w-full h-11 px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm kiếm theo tên, địa điểm..."
                />
              </div>

              {/* Price Range Select */}
              <div className="w-full md:w-[25%]">
                <select
                  className="w-full h-11 px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                  value={priceRangeValue}
                  onChange={handlePriceRangeChange}
                >
                  <option value="">Chọn khoảng giá</option>
                  <option value="0-5">0 - 5 Triệu</option>
                  <option value="5-10">5 - 10 Triệu</option>
                  <option value="10-15">10 - 15 Triệu</option>
                  <option value="15-20">15 - 20 Triệu</option>
                  <option value="20+">Trên 20 Triệu</option>
                </select>
              </div>

              {/* Guest Input */}
              <div className="w-full md:w-[15%]">
                <input
                  type="number"
                  className="w-full h-11 px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  value={minGuests || ""}
                  onChange={(e) => setMinGuests(e.target.value ? parseInt(e.target.value) : undefined)}
                  min="1"
                  placeholder="Số khách"
                />
              </div>

              {/* Bedrooms Input */}
              <div className="w-full md:w-[15%]">
                <input
                  type="number"
                  className="w-full h-11 px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  value={bedrooms || ""}
                  onChange={(e) => setBedrooms(e.target.value ? parseInt(e.target.value) : undefined)}
                  min="1"
                  placeholder="Phòng ngủ"
                />
              </div>

              {/* Search Button */}
              <div className="w-full md:w-[15%]">
                <button
                  type="submit"
                  className="w-full h-11 px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition duration-300 text-sm"
                  disabled={loading}
                >
                  {loading ? "ĐANG TÌM..." : "TÌM KIẾM"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-medium text-gray-700 mb-6">
          Kết quả tìm kiếm
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : villas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">
              Không tìm thấy kết quả phù hợp. Vui lòng thử lại với tiêu chí khác.
            </p>
          </div>
        ) : (
          <>
            {/* Grid of villas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentItems.map((villa) => {
                const discountedPrice = getDiscountedPrice(villa);
                const hasDiscount = discountedPrice < villa.basePrice;
                const discountPercentage = getDiscountPercentage(villa);
                
                return (
                  <div
                    key={villa._id}
                    className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <Link href={`/villa/${villa.slug}`} className="block">
                      {/* Villa Image with Price */}
                      <div className="relative h-48 overflow-hidden">
                        {/* Price tag */}
                        <div className="absolute top-2 left-2 bg-white/90 px-3 py-1 z-10 font-medium text-sm rounded-sm">
                          {hasDiscount ? (
                            <div>
                              <span className="text-red-600">{formatPrice(discountedPrice)}</span>
                              <span className="text-gray-500 line-through text-xs ml-1">
                                {formatPrice(villa.basePrice)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-700">{formatPrice(villa.basePrice)}/đêm</span>
                          )}
                        </div>
                        
                        {/* Discount badge */}
                        {discountPercentage > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-sm text-xs font-medium z-10">
                            -{discountPercentage}%
                          </div>
                        )}
                        
                        <Image
                          src={villa.images[0] || "https://placehold.co/2560x1440/png"}
                          alt={villa.name}
                          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      </div>

                      {/* Villa Details */}
                      <div className="p-4">
                        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 h-12">
                          {villa.name}
                        </h3>

                        {/* Rating Stars */}
                        <div className="flex mb-3">
                          {Array(5).fill(0).map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < calculateAverageRating(villa.reviews)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-2 mb-2 text-sm text-gray-600">
                          <MapPinIcon className="h-5 w-5 flex-shrink-0 text-gray-400 mt-0.5" />
                          <span className="line-clamp-2">
                            {villa.location?.address || villa.subDescription}
                          </span>
                        </div>

                        {/* Area */}
                        <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                          <HomeIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                          <span>Biệt thự {villa.size} m²</span>
                        </div>

                        {/* Capacity */}
                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                          <UserIcon className="h-5 w-5 flex-shrink-0 text-gray-400" />
                          <span>
                            {villa.maxGuests} người · {villa.bedrooms} phòng ngủ
                          </span>
                        </div>

                        {/* Promotion badge */}
                        {hasDiscount && (
                          <div className="flex items-center gap-2 mb-3 text-sm text-red-600">
                            <TagIcon className="h-5 w-5 flex-shrink-0" />
                            <span className="font-medium">Đang có khuyến mãi</span>
                          </div>
                        )}

                        {/* View Details Button */}
                        <div className="text-center">
                          <span className="inline-block border border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-500 px-4 py-1 text-sm uppercase tracking-wide transition-colors duration-200">
                            XEM CHI TIẾT
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <nav className="flex items-center">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-full mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &lt;
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => {
                      if (
                        number === 1 ||
                        number === totalPages ||
                        (number >= currentPage - 1 && number <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full mx-1 ${
                              currentPage === number
                                ? "bg-blue-900 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {number}
                          </button>
                        );
                      } else if (
                        number === currentPage - 2 ||
                        number === currentPage + 2
                      ) {
                        return (
                          <span key={number} className="mx-1">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-full ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &gt;
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}