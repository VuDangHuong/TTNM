import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

interface VillaDescriptionProps {
  description: string;
}

const VillaDescription = ({ description }: VillaDescriptionProps) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  return (
    <div className="mb-8 pb-8">
      <div
        className={`prose max-w-none ${
          showFullDescription ? "" : "line-clamp-[12]"
        }`}
        dangerouslySetInnerHTML={{ __html: description }}
      ></div>
      <button
        onClick={() => setShowFullDescription(!showFullDescription)}
        className="mt-4 flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        {showFullDescription ? (
          <>
            <ChevronUpIcon className="h-5 w-5 mr-1" />
            Thu gọn
          </>
        ) : (
          <>
            <ChevronDownIcon className="h-5 w-5 mr-1" />
            Xem thêm
          </>
        )}
      </button>
    </div>
  );
};

export default VillaDescription;