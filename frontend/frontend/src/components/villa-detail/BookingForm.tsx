import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import {
  formatPrice,
  calculateDiscountedPrice,
  formatDateString,
  getDaysBetweenDates,
  calculateTotalPrice,
  getDayName
} from "./utils/price-utils";
import DiscountDisplay from "./DiscountDisplay";
import { Villa } from "./utils/type";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  villa: Villa;
  isSticky: boolean;
}

const BookingForm = ({ villa, isSticky }: BookingFormProps) => {
  const router = useRouter();

  const [guestCount, setGuestCount] = useState(1);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const incrementGuests = () => {
    setGuestCount(guestCount + 1);
  };

  const decrementGuests = () => {
    if (guestCount > 1) setGuestCount(guestCount - 1);
  };

  const hasActiveDiscount =
    villa.discounts &&
    villa.discounts.some(
      (d) =>
        d.isActive &&
        new Date(d.startDate) <= new Date() &&
        new Date(d.endDate) >= new Date()
    );
  const handleBooking = () => {
    if (!checkInDate || !checkOutDate) {
      alert("Vui lòng chọn ngày nhận phòng và trả phòng");
      return;
    }

    // Tính tổng tiền
    const totalPrice = calculateTotalPrice(villa, checkInDate, checkOutDate);

    // Tính số đêm
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const nights = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Set booking flag in localStorage
    localStorage.setItem("bookingFlow", "active");

    // Store booking details
    const bookingDetails = {
      villaId: villa._id,
      villaName: villa.name,
      villaLocation: villa.location?.address || "",
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights: nights,
      guests: guestCount, // Giữ nguyên số người đặt
      totalPrice: totalPrice,
      timestamp: Date.now(),
    };
    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));

    // Chuyển hướng đến trang checkout với thông tin đặt phòng
    router.push(
      `/checkout?villaId=${villa._id}&villaName=${encodeURIComponent(
        villa.name
      )}&villaLocation=${encodeURIComponent(
        villa.location?.address || ""
      )}&checkIn=${checkInDate}&checkOut=${checkOutDate}&nights=${nights}&guests=${guestCount}&totalPrice=${totalPrice}`
    );
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg p-6 ${
        isSticky ? "lg:sticky lg:top-24" : ""
      }`}
    >
      {/* Price Display */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center">
            {hasActiveDiscount ? (
              <>
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(
                    calculateTotalPrice(villa, checkInDate, checkOutDate) -
                      villa.serviceCharge
                  )}
                </span>
                <span className="ml-2 text-lg line-through text-gray-500">
                  {formatPrice(villa.basePrice)}
                </span>
              </>
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">
                {formatPrice(villa.basePrice)}
              </h2>
            )}
          </div>
          <p className="text-gray-500 text-sm">
            giá cơ bản mỗi đêm (Chưa tính giảm giá nếu có)
          </p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
          {villa.isAvailable ? "Còn phòng" : "Hết phòng"}
        </div>
      </div>

      {/* Booking Form */}
      <div className="space-y-4">
        {/* Date Range Picker */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Nhận phòng
            </label>
            <div className="relative">
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Trả phòng
            </label>
            <div className="relative">
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                min={checkInDate || new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:transparent"
              />
            </div>
          </div>
        </div>

        {/* Guest Counter */}
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Số lượng khách
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={decrementGuests}
              disabled={guestCount <= 1}
              className={`px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors ${
                guestCount <= 1
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <span className="text-xl">−</span>
            </button>
            <input
              type="number"
              value={guestCount}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                if (!isNaN(value) && value >= 1) {
                  setGuestCount(value);
                }
              }}
              min="1"
              className="w-full text-center px-2 py-2.5 border-none outline-none"
            />

            <button
              type="button"
              onClick={incrementGuests}
              className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <span className="text-xl">+</span>
            </button>
          </div>
          <div className="mt-1">
            <p className="text-gray-500 text-xs">
              Khuyến nghị tối đa {villa.maxGuests} khách
            </p>
            {guestCount > villa.maxGuests && (
              <div>
                <p className="text-amber-600 text-xs mt-1">
                  * Có phụ thu thêm khi vượt quá số lượng khuyến nghị
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  * Giá hiển thị chưa bao gồm phụ thu (sẽ được thông báo sau)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Price Summary */}
        {checkInDate && checkOutDate && (
          <div className="py-4 my-4 space-y-2">
            {/* Hiển thị chi tiết giá theo từng ngày */}
            {getDaysBetweenDates(
              checkInDate,
              new Date(new Date(checkOutDate).getTime() - 86400000)
            ).map((date, index) => {
              const dayName = getDayName(date);
              const dayPrice = villa.priceByDay.find((p) => p.day === dayName);
              const basePrice = dayPrice
                ? typeof dayPrice.price === "string"
                  ? parseFloat(dayPrice.price.replace(/[^\d]/g, ""))
                  : dayPrice.price
                : villa.basePrice;
              const discountedPrice = calculateDiscountedPrice(
                basePrice,
                villa.discounts,
                date
              );

              return (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-600">
                    {formatDateString(date.toISOString())} ({dayName})
                  </span>
                  <span className="font-medium">
                    {basePrice !== discountedPrice ? (
                      <>
                        <span className="line-through text-gray-500 mr-2">
                          {formatPrice(basePrice)}
                        </span>
                        {formatPrice(discountedPrice)}
                      </>
                    ) : (
                      formatPrice(basePrice)
                    )}
                  </span>
                </div>
              );
            })}

            <div className="flex justify-between">
              <span className="text-gray-600">Phí dịch vụ</span>
              <span className="font-medium">
                {formatPrice(villa.serviceCharge)}
              </span>
            </div>

            <div className="flex justify-between pt-3 mt-3 border-t">
              <span className="font-bold">Tổng tiền</span>
              <span className="font-bold">
                {formatPrice(
                  calculateTotalPrice(villa, checkInDate, checkOutDate)
                )}
                {guestCount > villa.maxGuests && (
                  <span className="block text-xs text-amber-600 font-normal mt-1">
                    * Chưa bao gồm phụ thu
                  </span>
                )}
              </span>
            </div>
          </div>
        )}

        {/* Book Now Button */}
        <button
          type="button"
          onClick={handleBooking}
          disabled={!villa.isAvailable || !checkInDate || !checkOutDate}
          className={`w-full font-bold py-3.5 px-4 rounded-lg transition duration-300 flex items-center justify-center shadow-md hover:shadow-lg ${
            villa.isAvailable && checkInDate && checkOutDate
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-gray-300 cursor-not-allowed text-gray-500"
          }`}
        >
          {!villa.isAvailable
            ? "Hết phòng"
            : checkInDate && checkOutDate
            ? "Đặt ngay"
            : "Chọn ngày để đặt phòng"}
        </button>

        {/* Contact Info */}
        <div className="mt-4 text-center text-gray-600 flex items-center justify-center space-x-1">
          <span>Gọi</span>
          <a
            href="tel:0908506631"
            className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
          >
            0908 506 631
          </a>
          <span>để được hỗ trợ</span>
        </div>
      </div>

      {/* Features */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-bold mb-4 text-gray-800">Tính năng nổi bật</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">
              Villa đơn lập với {villa.bedrooms} phòng ngủ · {villa.beds} giường
            </span>
          </li>
          <li className="flex items-start">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">
              Diện tích {villa.size} m², phù hợp cho nhóm lớn
            </span>
          </li>
          {villa.location?.address && (
            <li className="flex items-start">
              <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">
                Vị trí đắc địa: {villa.location.address}
              </span>
            </li>
          )}

          {/* Display active discounts */}
          <DiscountDisplay discounts={villa.discounts || []} />
        </ul>
      </div>

      {/* Security Badge */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center bg-gray-50 p-4 rounded-lg">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-medium text-gray-800">Đặt phòng an toàn</h4>
            <p className="text-xs text-gray-500">Thanh toán được bảo mật</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
