// components/villa-detail/AmenitiesSection.tsx
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

interface AmenitiesSectionProps {
  amenities: {
    general: { name: string; available: boolean }[];
    kitchen: { name: string; available: boolean }[];
    common: { name: string; available: boolean }[];
    room: { name: string; available: boolean }[];
    bathroom: { name: string; available: boolean }[];
  };
}

const AmenitiesSection = ({ amenities }: AmenitiesSectionProps) => {
  const [expandedSection, setExpandedSection] = useState<string | null>("general");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Define the sections for cleaner rendering
  const sections = [
    {
      id: "general",
      title: "Lưu ý chung",
      items: amenities.general,
      cols: "md:grid-cols-2"
    },
    {
      id: "kitchen",
      title: "Tiện ích bếp",
      items: amenities.kitchen,
      cols: "md:grid-cols-3"
    },
    {
      id: "common",
      title: "Tiện ích chung",
      items: amenities.common,
      cols: "md:grid-cols-3"
    },
    {
      id: "room",
      title: "Tiện ích phòng",
      items: amenities.room,
      cols: "md:grid-cols-3"
    },
    {
      id: "bathroom",
      title: "Tiện ích phòng tắm",
      items: amenities.bathroom,
      cols: "md:grid-cols-3"
    }
  ];

  return (
    <div className="mb-8 pb-8">
      <h2 className="text-xl font-bold mb-4">Tiện nghi chỗ ở</h2>
      <p className="text-gray-600 mb-4">
        Giới thiệu về các tiện nghi và dịch vụ tại nơi lưu trú
      </p>

      {/* Render each section */}
      {sections.map(section => (
        <div key={section.id} className="mb-6">
          <button
            className="flex items-center justify-between w-full text-left font-bold mb-3 bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => toggleSection(section.id)}
          >
            <span>{section.title}</span>
            {expandedSection === section.id ? (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
          
          {expandedSection === section.id && (
            <div className={`grid grid-cols-1 ${section.cols} gap-4 mt-3 p-2`}>
              {section.items
                .filter(item => item.available)
                .map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span>{item.name}</span>
                  </div>
                ))}
              
              {section.items.filter(item => item.available).length === 0 && (
                <p className="text-gray-500 italic">Không có tiện ích trong mục này</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AmenitiesSection;
