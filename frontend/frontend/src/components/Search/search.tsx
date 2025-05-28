"use client"

import { useState, useRef, useEffect, MouseEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDownIcon, XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

const SearchForm = () => {
  const router = useRouter();
  
  // State for form fields
  const [query, setQuery] = useState('');
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [priceRange, setPriceRange] = useState('Khoảng giá');
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  
  // State for price range values
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  
  // Price range options with corresponding values
  const priceOptions = [
    { label: 'Khoảng giá', value: '' },
    { label: 'Dưới 5 triệu', value: '0-5' },
    { label: '5 - 10 triệu', value: '5-10' },
    { label: '10 - 15 triệu', value: '10-15' },
    { label: '15 - 20 triệu', value: '15-20' },
    { label: 'Trên 20 triệu', value: '20+' }
  ];
  
  // Refs for click outside detection
  const priceRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | Event) => {
      const target = event.target as Node;
      if (priceRef.current && !priceRef.current.contains(target)) {
        setShowPriceDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Update price range values when price option changes
  const handlePriceRangeChange = (option: string) => {
    setPriceRange(option);
    
    // Set minPrice and maxPrice based on the selected option
    switch (option) {
      case 'Dưới 5 triệu':
        setMinPrice(0);
        setMaxPrice(5000000);
        break;
      case '5 - 10 triệu':
        setMinPrice(5000000);
        setMaxPrice(10000000);
        break;
      case '10 - 15 triệu':
        setMinPrice(10000000);
        setMaxPrice(15000000);
        break;
      case '15 - 20 triệu':
        setMinPrice(15000000);
        setMaxPrice(20000000);
        break;
      case 'Trên 20 triệu':
        setMinPrice(20000000);
        setMaxPrice(undefined);
        break;
      default:
        setMinPrice(undefined);
        setMaxPrice(undefined);
    }
  };
  
  // Handle search submission
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Build query string parameters
    const params = new URLSearchParams();
    
    // Add query parameter if provided
    if (query && query.trim() !== '') {
      params.append('query', query);
    }
    
    // Add price range parameters
    if (minPrice !== undefined) {
      params.append('minPrice', minPrice.toString());
    }
    if (maxPrice !== undefined) {
      params.append('maxPrice', maxPrice.toString());
    }
    
    // Add guest count parameter
    if (guestCount > 1) {
      params.append('minGuests', guestCount.toString());
    }
    
    // Add room count parameter
    if (roomCount > 1) {
      params.append('bedrooms', roomCount.toString());
    }
    
    // Navigate to search page with query parameters
    router.push(`/tim-kiem?${params.toString()}`);
  };
  
  // Guest count handlers
  const decrementGuests = () => {
    if (guestCount > 1) setGuestCount(guestCount - 1);
  };
  
  const incrementGuests = () => {
    setGuestCount(guestCount + 1);
  };
  
  // Room count handlers
  const decrementRooms = () => {
    if (roomCount > 1) setRoomCount(roomCount - 1);
  };
  
  const incrementRooms = () => {
    setRoomCount(roomCount + 1);
  };
  
  // Clear query input
  const clearQuery = () => {
    setQuery('');
  };
  
  return (
    <div className="w-full bg-[#f1f0ec] py-4 px-4 md:px-8">
      <form onSubmit={handleSearch} className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-3">
        {/* Query/Location input field - now matching the search page */}
        <div className="relative bg-white w-full md:w-auto md:flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, địa điểm..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-11 px-4 py-2 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Price range dropdown */}
        <div className="relative w-full md:w-44" ref={priceRef}>
          <button
            type="button"
            onClick={() => setShowPriceDropdown(!showPriceDropdown)}
            className="w-full h-11 px-4 py-2 bg-white border border-gray-300 rounded text-left flex items-center justify-between text-sm text-gray-800 focus:outline-none"
          >
            <span>{priceRange}</span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </button>
          
          {showPriceDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
              {priceOptions.map((option, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 cursor-pointer text-sm ${
                    option.label === priceRange ? 'bg-gray-100 text-gray-800' : 'text-gray-800 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    handlePriceRangeChange(option.label);
                    setShowPriceDropdown(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Guest count */}
        <div className="relative w-full md:w-36">
          <div className="flex h-11">
            <button
              type="button"
              onClick={decrementGuests}
              className="w-11 flex items-center justify-center bg-white border border-r-0 border-gray-300 rounded-l focus:outline-none"
              aria-label="Decrease guest count"
            >
              <MinusIcon className="h-4 w-4 text-gray-700" />
            </button>
            <div className="flex-grow px-2 py-2 bg-white border-t border-b border-gray-300 flex items-center justify-center text-sm text-gray-800">
              <span>{guestCount} khách</span>
            </div>
            <button
              type="button"
              onClick={incrementGuests}
              className="w-11 flex items-center justify-center bg-white border border-l-0 border-gray-300 rounded-r focus:outline-none"
              aria-label="Increase guest count"
            >
              <PlusIcon className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </div>
        
        {/* Room count */}
        <div className="relative w-full md:w-36">
          <div className="flex h-11">
            <button
              type="button"
              onClick={decrementRooms}
              className="w-11 flex items-center justify-center bg-white border border-r-0 border-gray-300 rounded-l focus:outline-none"
              aria-label="Decrease room count"
            >
              <MinusIcon className="h-4 w-4 text-gray-700" />
            </button>
            <div className="flex-grow px-2 py-2 bg-white border-t border-b border-gray-300 flex items-center justify-center text-sm text-gray-800">
              <span>{roomCount} phòng ngủ</span>
            </div>
            <button
              type="button"
              onClick={incrementRooms}
              className="w-11 flex items-center justify-center bg-white border border-l-0 border-gray-300 rounded-r focus:outline-none"
              aria-label="Increase room count"
            >
              <PlusIcon className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </div>
        
        {/* Search button */}
        <button
          type="submit"
          className="w-full md:w-auto h-11 px-6 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded focus:outline-none transition duration-300"
        >
          TÌM KIẾM
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
