import { useState, useEffect } from "react";
import { calculateDiscountedPrice } from "./utils/price-utils";
import { Villa } from "./utils/type";

interface PriceSectionProps {
  villa: Villa;
}

const PriceSection = ({ villa }: PriceSectionProps) => {
  const [discountedPrices, setDiscountedPrices] = useState<
    Array<{
      day: string;
      price: string | number;
      originalPrice?: string | number;
      hasDiscount?: boolean;
    }>
  >([]);

  // Helper function to get date for specific day of week
  const getDateForDayOfWeek = (dayName: string): Date => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ...
    let targetDay: number;

    // Convert day name to day number
    switch (dayName) {
      case "Chủ nhật":
        targetDay = 0;
        break;
      case "Thứ 2":
        targetDay = 1;
        break;
      case "Thứ 3":
        targetDay = 2;
        break;
      case "Thứ 4":
        targetDay = 3;
        break;
      case "Thứ 5":
        targetDay = 4;
        break;
      case "Thứ 6":
        targetDay = 5;
        break;
      case "Thứ 7":
        targetDay = 6;
        break;
      default:
        targetDay = currentDay;
    }

    // Xác định ngày đầu tuần (Thứ 2) của tuần hiện tại
    const monday = new Date(today);
    const diff =
      today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
    monday.setDate(diff);

    // Tính toán ngày cần tìm dựa trên ngày đầu tuần
    const targetDate = new Date(monday);
    if (targetDay === 0) {
      // Chủ nhật (cuối tuần)
      targetDate.setDate(monday.getDate() + 6);
    } else {
      targetDate.setDate(monday.getDate() + targetDay - 1);
    }

    return targetDate;
  };

  // Thêm hàm sắp xếp thứ tự tuần
  const sortDaysByWorkWeek = (days: Array<{
    day: string;
    price: string | number;
    originalPrice?: string | number;
    hasDiscount?: boolean;
  }>) => {
    const dayOrder: Record<string, number> = {
      "Thứ 2": 1,
      "Thứ 3": 2,
      "Thứ 4": 3,
      "Thứ 5": 4,
      "Thứ 6": 5,
      "Thứ 7": 6,
      "Chủ nhật": 7
    };
    
    return [...days].sort((a, b) => {
      return dayOrder[a.day] - dayOrder[b.day];
    });
  };

  // Calculate discounted prices when component mounts or villa changes
  useEffect(() => {
    if (villa && villa.priceByDay && villa.discounts) {
      const hasActiveDiscount = villa.discounts.some((d) => d.isActive);

      if (hasActiveDiscount) {
        const updatedPrices = villa.priceByDay.map((dayPrice) => {
          const originalPrice =
            typeof dayPrice.price === "string"
              ? parseFloat(dayPrice.price.replace(/[^\d]/g, ""))
              : dayPrice.price;

          // Get the date for this day of week in the current week
          const dateForDay = getDateForDayOfWeek(dayPrice.day);

          // Check if this specific date is within any discount period
          const discountedPrice = calculateDiscountedPrice(
            originalPrice,
            villa.discounts,
            dateForDay
          );

          return {
            ...dayPrice,
            originalPrice: dayPrice.price,
            price: new Intl.NumberFormat("vi-VN").format(discountedPrice) + "đ",
            hasDiscount: discountedPrice < originalPrice,
          };
        });

        setDiscountedPrices(updatedPrices);
      } else {
        setDiscountedPrices([]);
      }
    }
  }, [villa]);

  const displayPrices =
    discountedPrices.length > 0 ? discountedPrices : villa.priceByDay;
  
  // Sắp xếp giá theo thứ tự tuần làm việc
  const sortedDisplayPrices = sortDaysByWorkWeek(displayPrices);
  
  // Xác định ngày hiện tại
  const getTodayName = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    if (dayOfWeek === 0) return "Chủ nhật";
    return `Thứ ${dayOfWeek + 1}`;
  };
  
  const todayName = getTodayName();

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Giá phòng tuần này</h2>
      <p className="text-gray-600 mb-2">
        {villa.discounts && villa.discounts.some((d) => d.isActive)
          ? "Giá đã được áp dụng khuyến mãi cho các ngày trong thời gian giảm giá"
          : "Giá có thể tăng vào cuối tuần hoặc ngày lễ"}
      </p>
      {/* Hiển thị khoảng thời gian của tuần hiện tại */}
      <p className="text-gray-500 text-sm mb-4">
        {(() => {
          const today = new Date();
          const mondayOfWeek = new Date(today);
          const diff =
            today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1);
          mondayOfWeek.setDate(diff);

          const sundayOfWeek = new Date(mondayOfWeek);
          sundayOfWeek.setDate(mondayOfWeek.getDate() + 6);

          return `Tuần từ ${mondayOfWeek.toLocaleDateString(
            "vi-VN"
          )} đến ${sundayOfWeek.toLocaleDateString("vi-VN")}`;
        })()}
      </p>
      {/* Display active discount periods */}
      {villa.discounts && villa.discounts.some((d) => d.isActive) && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-semibold mb-1">Thời gian giảm giá:</h3>
          <ul className="text-sm text-gray-700">
            {villa.discounts
              .filter((d) => d.isActive)
              .map((discount, idx) => (
                <li key={idx}>
                  {discount.value}
                  {discount.type === "percentage" ? "%" : "đ"} từ{" "}
                  {new Date(discount.startDate).toLocaleDateString("vi-VN")}
                  <span> đến</span>{" "}
                  {new Date(discount.endDate).toLocaleDateString("vi-VN")}
                </li>
              ))}
          </ul>
        </div>
      )}

      {/* Price Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm mb-6">
        <table className="w-full">
          <tbody>
            {sortedDisplayPrices.map((item, index) => {
              const isToday = item.day === todayName;
              
              return (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} ${
                    isToday ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    {item.day}
                    {isToday && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Hôm nay
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {"hasDiscount" in item && item.hasDiscount ? (
                      <div className="flex flex-col items-end">
                        <span className="font-medium text-red-600">
                          {item.price}
                        </span>
                        <span className="text-sm line-through text-gray-500">
                          {item.originalPrice}
                        </span>
                      </div>
                    ) : (
                      <span className="font-medium">{item.price}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Check-in/Check-out Times */}
      <h3 className="text-xl font-bold mb-4">Thời gian nhận phòng</h3>
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
        <table className="w-full">
          <tbody>
            <tr className="bg-gray-50">
              <td className="py-3 px-4">Nhận phòng</td>
              <td className="py-3 px-4 text-right">{villa.timing.checkIn}</td>
            </tr>
            <tr className="bg-white">
              <td className="py-3 px-4">Trả phòng</td>
              <td className="py-3 px-4 text-right">{villa.timing.checkOut}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PriceSection;
