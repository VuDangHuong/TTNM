import { useState, useRef, useEffect } from "react";
import { XMarkIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  formatPrice,
  calculateDiscountedPrice,
  formatDateString,
  calculateTotalPrice,
  getDayName,
  getDaysBetweenDates,
} from "./utils/price-utils";
import { Villa } from "./utils/type";
import { useRouter } from "next/navigation";

interface MobileBookingBarProps {
  villa: Villa;
}

const MobileBookingBar = ({ villa }: MobileBookingBarProps) => {
  const router = useRouter();

  const [isMobileFormExpanded, setIsMobileFormExpanded] = useState(false);
  const [mobileActiveSection, setMobileActiveSection] = useState<string | null>(
    null
  );
  const [guestCount, setGuestCount] = useState(1);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  const mobileFormRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileFormRef.current &&
        !mobileFormRef.current.contains(event.target as Node)
      ) {
        setIsMobileFormExpanded(false);
      }
    };

    if (isMobileFormExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileFormExpanded]);

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

  return (
    <>
      {/* Overlay for mobile form */}
      {isMobileFormExpanded && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20"
          onClick={() => setIsMobileFormExpanded(false)}
        />
      )}

      {/* Mobile Sticky Booking Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30">
        {/* Collapsed Bar */}
        {!isMobileFormExpanded && (
          <div className="bg-white px-4 py-3 shadow-lg flex items-center justify-between border-t border-gray-200">
            <div>
              {hasActiveDiscount ? (
                <div className="flex items-center">
                  <p className="font-bold text-lg">
                    {formatPrice(
                      calculateTotalPrice(villa, checkInDate, checkOutDate) -
                        villa.serviceCharge
                    )}
                  </p>
                  <p className="ml-2 text-sm line-through text-gray-500">
                    {formatPrice(villa.basePrice)}
                  </p>
                </div>
              ) : (
                <p className="font-bold text-lg">
                  {formatPrice(villa.basePrice)}
                </p>
              )}
              <p className="text-gray-500 text-xs">
                Giá cơ bản mỗi đêm (Chưa tính giảm giá nếu có)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileFormExpanded(true)}
              disabled={!villa.isAvailable}
              className={`py-2.5 px-6 rounded-lg transition duration-300 font-bold ${
                villa.isAvailable
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 cursor-not-allowed text-gray-500"
              }`}
            >
              {villa.isAvailable ? "Đặt ngay" : "Hết phòng"}
            </button>
          </div>
        )}

        {/* Expanded Form */}
        {isMobileFormExpanded && (
          <div
            ref={mobileFormRef}
            className="bg-white shadow-lg border-t border-gray-200 transition-all duration-300 ease-in-out"
            style={{
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="font-bold text-lg">Đặt phòng</h3>
              <button
                onClick={() => setIsMobileFormExpanded(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Booking Form Content */}
            <div className="p-4 space-y-4">
              {/* Date Selection Section */}
              <div className="space-y-2">
                <div
                  className={`p-3 border rounded-lg ${
                    mobileActiveSection === "dates"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onClick={() =>
                    setMobileActiveSection(
                      mobileActiveSection === "dates" ? null : "dates"
                    )
                  }
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-700">Ngày</p>
                      <p className="text-sm text-gray-500">
                        {checkInDate && checkOutDate
                          ? `${checkInDate} → ${checkOutDate}`
                          : "Chọn ngày nhận và trả phòng"}
                      </p>
                    </div>
                    <ChevronDownIcon
                      className={`h-5 w-5 transition-transform ${
                        mobileActiveSection === "dates" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {mobileActiveSection === "dates" && (
                  <div className="p-3 border border-gray-300 rounded-lg bg-white">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Nhận phòng
                        </label>
                        <input
                          type="date"
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                          Trả phòng
                        </label>
                        <input
                          type="date"
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          min={
                            checkInDate ||
                            new Date().toISOString().split("T")[0]
                          }
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Guest Selection Section */}
              <div className="space-y-2">
                <div
                  className={`p-3 border rounded-lg ${
                    mobileActiveSection === "guests"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300"
                  }`}
                  onClick={() =>
                    setMobileActiveSection(
                      mobileActiveSection === "guests" ? null : "guests"
                    )
                  }
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-700">Khách</p>
                      <p className="text-sm text-gray-500">
                        {guestCount} khách
                      </p>
                    </div>
                    <ChevronDownIcon
                      className={`h-5 w-5 transition-transform ${
                        mobileActiveSection === "guests" ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {mobileActiveSection === "guests" && (
                  <div className="p-3 border border-gray-300 rounded-lg bg-white">
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
                        <div className="flex-grow px-4 py-2.5 text-center font-medium">
                          {guestCount} {guestCount === 1 ? "khách" : "khách"}
                        </div>
                        <button
                          type="button"
                          onClick={incrementGuests}
                          className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <span className="text-xl">+</span>
                        </button>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        Khuyến nghị tối đa {villa.maxGuests} khách
                      </p>
                      {guestCount > villa.maxGuests && (
                        <p className="text-amber-600 text-xs mt-1">
                          * Có phụ thu thêm khi vượt quá số lượng khuyến nghị
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Summary - Only show when dates are selected */}
              {checkInDate && checkOutDate && (
                <div className="py-4 my-4 space-y-2">
                  {/* Hiển thị chi tiết giá theo từng ngày */}
                  {getDaysBetweenDates(
                    checkInDate,
                    new Date(new Date(checkOutDate).getTime() - 86400000)
                  ).map((date, index) => {
                    const dayName = getDayName(date);
                    const dayPrice = villa.priceByDay.find(
                      (p) => p.day === dayName
                    );
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
                        <span className="text-gray-600 text-sm">
                          {formatDateString(date.toISOString())} ({dayName})
                        </span>
                        <span className="font-medium text-sm">
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
                    </span>
                  </div>
                  {guestCount > villa.maxGuests && (
                    <span className="block text-xs text-amber-600 font-normal mt-1">
                      * Chưa bao gồm phụ thu
                    </span>
                  )}
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
                aria-label="Đặt phòng ngay"
              >
                {!villa.isAvailable
                  ? "Hết phòng"
                  : checkInDate && checkOutDate
                  ? "Tiến hành đặt phòng"
                  : "Chọn ngày để đặt phòng"}
              </button>

              {/* Contact Info */}
              <div className="text-center text-gray-600 flex items-center justify-center space-x-1">
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
          </div>
        )}
      </div>
    </>
  );
};

export default MobileBookingBar;
