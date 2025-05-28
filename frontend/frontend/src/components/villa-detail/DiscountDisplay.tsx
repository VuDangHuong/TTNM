import { formatDateString } from "./utils/date-utils";
import { Discount } from "./utils/type";

interface DiscountDisplayProps {
  discounts: Discount[];
}

const DiscountDisplay = ({ discounts }: DiscountDisplayProps) => {
  if (!discounts || !discounts.some(d => d.isActive)) {
    return null;
  }
  
  const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Saigon" });
  const currentDate = new Date(now);
  
  const activeDiscounts = discounts.filter(
    d => d.isActive &&
         new Date(d.startDate) <= currentDate &&
         new Date(d.endDate) >= currentDate
  );
  
  if (activeDiscounts.length === 0) {
    return null;
  }
  
  return (
    <li className="flex items-start">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm7 9a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <span className="text-gray-700 font-medium">
          Đang có khuyến mãi:
        </span>
        <ul className="mt-1 space-y-1">
          {activeDiscounts.map((discount, idx) => (
            <li key={idx} className="text-sm text-gray-600">
              {discount.name}:{" "}
              {discount.type === "percentage"
                ? `${discount.value}%`
                : new Intl.NumberFormat("vi-VN").format(discount.value) + "đ"}{" "}
              <span className="text-xs text-gray-500">
                (đến {formatDateString(discount.endDate)})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default DiscountDisplay;