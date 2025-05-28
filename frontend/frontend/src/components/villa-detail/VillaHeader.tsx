import { UserIcon, HomeIcon, BuildingOfficeIcon } from "@heroicons/react/24/solid";
import { Villa } from "./utils/type";

interface VillaHeaderProps {
  villa: Villa;
}

const VillaHeader = ({ villa }: VillaHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        {villa.name}
      </h1>
      <p className="text-gray-600 mb-3">{villa.subDescription}</p>
      <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-700">
        <div className="flex items-center">
          <HomeIcon className="h-5 w-5 text-gray-500 mr-1" />
          <span>Biệt thự đơn lập · {villa.size} m²</span>
        </div>
        <div className="flex items-center">
          <BuildingOfficeIcon className="h-5 w-5 text-gray-500 mr-1" />
          <span>{villa.bedrooms} phòng ngủ · {villa.beds} giường</span>
        </div>
        <div className="flex items-center">
          <UserIcon className="h-5 w-5 text-gray-500 mr-1" />
          <span>
            Nguyên căn · {villa.maxGuests} khách (tối đa{" "}
            {villa.maxGuests} khách)
          </span>
        </div>
      </div>
    </div>
  );
};

export default VillaHeader;