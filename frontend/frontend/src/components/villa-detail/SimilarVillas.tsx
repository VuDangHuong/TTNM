// components/villa-detail/SimilarVillas.tsx
import Link from "next/link";
import Image from "next/image";
import { UserIcon, HomeIcon } from "@heroicons/react/24/solid";
import { formatPrice } from "./utils/price-utils";
import { Villa } from "./utils/type";

interface SimilarVillasProps {
  villas: Villa[];
}

const SimilarVillas = ({ villas }: SimilarVillasProps) => {
  if (!villas || villas.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-bold mb-6">Các villa tương tự</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {villas.map((villa) => (
          <Link
            key={villa._id}
            href={`/villa/${villa.slug}`}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48">
              <Image
                src={villa.images[0] || "https://placehold.co/2560x1440/png"}
                alt={villa.name}
                fill
                className="object-cover"
                unoptimized={true}
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-blue-600 text-sm font-medium px-2 py-1 rounded-full">
                {formatPrice(villa.basePrice)}
              </div>
              
              {/* Display discount badge if applicable */}
              {villa.discounts && villa.discounts.some(d => 
                d.isActive && 
                new Date(d.startDate) <= new Date() && 
                new Date(d.endDate) >= new Date()
              ) && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                  Giảm giá
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-1 text-gray-800">
                {villa.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {villa.location?.address || "Vị trí đẹp"}
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <span className="flex items-center mr-3">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {villa.maxGuests} khách
                </span>
                <span className="flex items-center">
                  <HomeIcon className="h-4 w-4 mr-1" />
                  {villa.bedrooms} phòng · {villa.beds} giường
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarVillas;
