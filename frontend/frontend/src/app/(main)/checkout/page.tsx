"use client";

import {
  useState,
  FC,
  ChangeEvent,
  FormEvent,
  useEffect,
  Suspense,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import BookingSuccessPage from "./success";
import { fakeDataService } from "@/services/fakeData";

// Định nghĩa kiểu dữ liệu
interface BookingDetails {
  villaId?: string;
  villaName: string;
  villaLocation: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  totalPrice: number;
  basePrice: number;
}

interface CustomerInfo {
  fullName: string;
  phone: string;
  email: string;
}

// Loading component for Suspense fallback
const LoadingPage = () => (
  <div className="bg-gray-50 min-h-screen py-8">
    <div className="container mx-auto px-4 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Đang tải thông tin đặt phòng...
      </h1>
    </div>
  </div>
);

// Component to fetch search params safely
const CheckoutPageContent: FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State để theo dõi xem component đã được mount trên client chưa
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra quyền truy cập trang checkout
  useEffect(() => {
    setIsClient(true);

    // Chỉ truy cập localStorage sau khi component đã mount trên client
    const bookingFlow = localStorage.getItem("bookingFlow");
    const storedDetails = localStorage.getItem("bookingDetails");

    if (!bookingFlow || bookingFlow !== "active" || !storedDetails) {
      router.push("/");
      return;
    }

    // Kiểm tra thời gian đặt phòng (15 phút)
    try {
      const details = JSON.parse(storedDetails);
      const timeDiff = Date.now() - details.timestamp;
      if (timeDiff > 15 * 60 * 1000) {
        // 15 phút
        localStorage.removeItem("bookingFlow");
        localStorage.removeItem("bookingDetails");
        router.push("/");
        return;
      }
    } catch (error) {
      console.error("Error parsing stored details:", error);
      router.push("/");
    }
    
    setIsLoading(false);
  }, [router]);

  // Lấy thông tin từ URL hoặc sử dụng thông tin mặc định
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    villaId: searchParams?.get("villaId") || "1",
    villaName: searchParams?.get("villaName") || "Villa Biển Xanh",
    villaLocation: searchParams?.get("villaLocation") || "FLC Sầm Sơn, Quảng Cư, Sầm Sơn, Thanh Hóa",
    checkInDate: searchParams?.get("checkIn") || "2025-04-10",
    checkOutDate: searchParams?.get("checkOut") || "2025-04-13",
    nights: parseInt(searchParams?.get("nights") || "3"),
    guests: parseInt(searchParams?.get("guests") || "4"),
    totalPrice: parseInt(searchParams?.get("totalPrice") || "25500000"),
    basePrice: parseInt(searchParams?.get("basePrice") || "8500000"),
  });

  // Bổ sung thông tin villa từ fake data
  useEffect(() => {
    if (!isClient || !bookingDetails.villaId) return;

    const fetchVillaData = async () => {
      try {
        // Lấy thông tin villa từ fake data
        const villa = await fakeDataService.getVillaById(bookingDetails.villaId!);
        
        if (villa) {
          setBookingDetails(prev => ({
            ...prev,
            villaName: villa.name,
            villaLocation: villa.location?.address || prev.villaLocation,
            basePrice: villa.basePrice,
            // Tính toán lại giá nếu cần
            totalPrice: calculateTotalPrice(
              villa.basePrice, 
              prev.nights, 
              villa.discounts && villa.discounts.length > 0 && villa.discounts[0].isActive 
                ? villa.discounts[0] 
                : undefined
            )
          }));
        }
      } catch (error) {
        console.error("Error fetching villa data:", error);
      }
    };

    fetchVillaData();
  }, [isClient, bookingDetails.villaId]);

  const calculateTotalPrice = (basePrice: number, nights: number, discount?: any) => {
    let totalPrice = basePrice * nights;
    
    if (discount) {
      if (discount.type === 'percentage') {
        totalPrice = totalPrice * (1 - discount.value / 100);
      } else if (discount.type === 'fixed') {
        totalPrice = totalPrice - discount.value;
      }
    }
    
    return totalPrice;
  };

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: "",
    phone: "",
    email: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"credit_card" | "bank_transfer" | "cash">("credit_card");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({});
  const [submitError, setSubmitError] = useState<string>("");

  // Kiểm tra thông tin booking từ localStorage khi component mount
  useEffect(() => {
    if (!isClient) return;

    const savedCustomerInfo = localStorage.getItem("customerInfo");
    if (savedCustomerInfo) {
      try {
        const parsedInfo = JSON.parse(savedCustomerInfo);
        setCustomerInfo(parsedInfo);
      } catch (e) {
        console.error("Error parsing saved customer info:", e);
      }
    }
  }, [isClient]);

  // Xử lý thay đổi thông tin khách hàng
  const handleCustomerInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa lỗi khi người dùng nhập
    if (errors[name as keyof CustomerInfo]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Xử lý thay đổi phương thức thanh toán
  const handlePaymentMethodChange = (method: "credit_card" | "bank_transfer" | "cash") => {
    setPaymentMethod(method);
  };

  // Xác thực form
  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerInfo> = {};

    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(customerInfo.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^\S+@\S+\.\S+$/.test(customerInfo.email.trim())) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý đặt phòng
  const handleBooking = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Lưu thông tin khách hàng vào localStorage để sử dụng lần sau
      if (isClient) {
        localStorage.setItem("customerInfo", JSON.stringify(customerInfo));
      }

      // Giả lập thời gian chờ để tạo cảm giác xử lý
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Giả lập booking thành công
      setBookingId(`BOOKING-${Date.now()}`);
      
      // Xóa thông tin booking flow
      if (isClient) {
        localStorage.removeItem("bookingFlow");
        localStorage.removeItem("bookingDetails");
      }

      // Hiển thị trang thành công
      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting booking:", error);
      setSubmitError("Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại sau.");
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <BookingSuccessPage
        bookingId={bookingId}
        customerEmail={customerInfo.email}
      />
    );
  }
  
  if (isLoading) {
    return <LoadingPage />;
  }

  // Format giá tiền
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  // Format ngày tháng
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, "dd/MM/yyyy", { locale: vi });
  };

  // Lấy tên thứ trong tuần
  const getDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, "EEEE", { locale: vi });
  };

  // Hiển thị placeholder nếu đang render trên server
  if (!isClient) {
    return <LoadingPage />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Xác nhận đặt phòng
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột bên trái - Form đặt phòng */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Thông tin đặt phòng
              </h2>

              {/* Hiển thị số khách (không cho phép thay đổi) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số khách
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={`${bookingDetails.guests} Khách`}
                    disabled
                    className="w-full border border-gray-300 bg-gray-50 rounded-md py-2 px-3 text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Thời gian đặt phòng */}
              <div className="mb-4">
                <h3 className="text-base font-medium mb-4">
                  {bookingDetails.nights} đêm tại {bookingDetails.villaName}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ngày nhận phòng */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-green-400 to-green-500"></div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-1">Nhận phòng</p>
                      <p className="text-xl font-semibold mb-1">
                        {formatDate(bookingDetails.checkInDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {getDayOfWeek(bookingDetails.checkInDate)}
                      </p>
                    </div>
                  </div>

                  {/* Ngày trả phòng */}
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-1">Trả phòng</p>
                      <p className="text-xl font-semibold mb-1">
                        {formatDate(bookingDetails.checkOutDate)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {getDayOfWeek(bookingDetails.checkOutDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trách nhiệm vật chất */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold mb-3">
                Trách nhiệm vật chất
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Khách hàng có trách nhiệm khi sảy ra thiệt hại về tài sản đã gây
                ra tại chỗ ở trong thời gian lưu trú.
              </p>

              {/* Nội quy chỗ ở */}
              <h2 className="text-lg font-semibold mb-3">Nội quy chỗ ở</h2>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>
                  Yêu cầu chứng minh thư/ căn cước công dân/ hộ chiếu hoặc đặt
                  cọc tại chỗ nghỉ
                </li>
                <li>Hạn chế làm ồn sau 10 giờ tối</li>
                <li>Không đi giày/dép trong nhà</li>
                <li>Không hút thuốc ở khu vực chung</li>
              </ul>
            </div>

            {/* Thông tin khách hàng */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Thông tin của bạn</h2>

              <form onSubmit={handleBooking}>
                {/* Họ tên */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="text-red-500">*</span>Tên Khách hàng
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Họ tên trên CMND/ Thẻ căn cước"
                    value={customerInfo.fullName}
                    onChange={handleCustomerInfoChange}
                    className={`w-full border ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="text-red-500">*</span>Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Số điện thoại của bạn"
                      value={customerInfo.phone}
                      onChange={handleCustomerInfoChange}
                      className={`w-full border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="text-red-500">*</span>Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="VD: email@example.com"
                      value={customerInfo.email}
                      onChange={handleCustomerInfoChange}
                      className={`w-full border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phương thức thanh toán */}
                <div className="mb-6">
                  <h3 className="text-base font-medium mb-3">Phương thức thanh toán</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        id="payment-credit-card"
                        name="paymentMethod"
                        type="radio"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        checked={paymentMethod === "credit_card"}
                        onChange={() => handlePaymentMethodChange("credit_card")}
                      />
                      <label htmlFor="payment-credit-card" className="ml-3 block text-sm font-medium text-gray-700 flex items-center">
                        <span className="mr-2">Thẻ tín dụng / Ghi nợ</span>
                        <div className="flex space-x-1">
                          <svg className="h-6 w-auto" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="36" height="24" rx="4" fill="#016FD0" />
                            <path d="M18.2692 7.50977H14.7307V16.4906H18.2692V7.50977Z" fill="white" />
                            <path d="M15.0307 11.9998C15.0307 10.2498 15.9769 8.6998 17.5 7.89981C16.7615 7.32481 15.8154 6.9998 14.7692 6.9998C12.1538 6.9998 10 9.22481 10 11.9998C10 14.7748 12.1538 16.9998 14.7692 16.9998C15.8154 16.9998 16.7615 16.6748 17.5 16.0998C15.9769 15.2998 15.0307 13.7498 15.0307 11.9998Z" fill="white" />
                            <path d="M26 7.5H23V16.5H26V7.5Z" fill="white" />
                            <path d="M26.7308 11.9998C26.7308 14.7748 24.5769 16.9998 21.9615 16.9998C20.9154 16.9998 19.9692 16.6748 19.2308 16.0998C20.7538 15.2998 21.7 13.7498 21.7 11.9998C21.7 10.2498 20.7538 8.6998 19.2308 7.89981C19.9692 7.32481 20.9154 6.9998 21.9615 6.9998C24.5769 6.9998 26.7308 9.22481 26.7308 11.9998Z" fill="white" />
                          </svg>
                          <svg className="h-6 w-auto" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="36" height="24" rx="4" fill="#FF5F00" />
                            <path d="M22.5 12C22.5 9.5 21 7.5 19 6.5C17.5 8 16.5 10 16.5 12C16.5 14 17.5 16 19 17.5C21 16.5 22.5 14.5 22.5 12Z" fill="#EB001B" />
                            <path d="M16.5 12C16.5 9.5 18 7.5 20 6.5C18 5.5 15.5 5.5 13.5 6.5C11.5 7.5 10 9.5 10 12C10 14.5 11.5 16.5 13.5 17.5C15.5 18.5 18 18.5 20 17.5C18 16.5 16.5 14.5 16.5 12Z" fill="#F79E1B" />
                          </svg>
                        </div>
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="payment-bank-transfer"
                        name="paymentMethod"
                        type="radio"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        checked={paymentMethod === "bank_transfer"}
                        onChange={() => handlePaymentMethodChange("bank_transfer")}
                      />
                      <label htmlFor="payment-bank-transfer" className="ml-3 block text-sm font-medium text-gray-700">
                        Chuyển khoản ngân hàng
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="payment-cash"
                        name="paymentMethod"
                        type="radio"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        checked={paymentMethod === "cash"}
                        onChange={() => handlePaymentMethodChange("cash")}
                      />
                      <label htmlFor="payment-cash" className="ml-3 block text-sm font-medium text-gray-700">
                        Thanh toán tiền mặt tại Villa
                      </label>
                    </div>
                  </div>
                </div>

                {paymentMethod === "bank_transfer" && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Thông tin chuyển khoản</h4>
                    <p className="text-xs text-blue-700 mb-1">Ngân hàng: <span className="font-medium">Vietcombank</span></p>
                    <p className="text-xs text-blue-700 mb-1">Số tài khoản: <span className="font-medium">1234567890</span></p>
                    <p className="text-xs text-blue-700 mb-1">Chủ tài khoản: <span className="font-medium">Công ty Villa FLC</span></p>
                    <p className="text-xs text-blue-700 mt-2">
                      <span className="italic">Lưu ý: Vui lòng ghi rõ Họ tên và Số điện thoại của bạn trong nội dung chuyển khoản</span>
                    </p>
                  </div>
                )}

                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                    {submitError}
                  </div>
                )}

                {/* Nút đặt ngay */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </>
                  ) : (
                    "ĐẶT NGAY »"
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Cột bên phải - Chi tiết đặt phòng */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Chi tiết đặt phòng</h2>

              {/* Thông tin villa */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-base font-medium mb-4">
                  Thông tin đặt phòng
                </h3>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {bookingDetails.villaName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {bookingDetails.villaLocation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Thời gian đặt phòng */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {bookingDetails.nights} đêm ·{" "}
                      {formatDate(bookingDetails.checkInDate)} -{" "}
                      {formatDate(bookingDetails.checkOutDate)}
                    </p>
                  </div>
                </div>

                {/* Số khách */}
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {bookingDetails.guests} khách
                    </p>
                  </div>
                </div>
              </div>

              {/* Chi tiết giá */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-base font-medium mb-4">Chi tiết giá</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{formatPrice(bookingDetails.basePrice)} x {bookingDetails.nights} đêm</span>
                    <span className="text-gray-900">{formatPrice(bookingDetails.basePrice * bookingDetails.nights)}</span>
                  </div>
                  
                  {bookingDetails.totalPrice < (bookingDetails.basePrice * bookingDetails.nights) && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá</span>
                      <span>-{formatPrice((bookingDetails.basePrice * bookingDetails.nights) - bookingDetails.totalPrice)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí dịch vụ 10%</span>
                    <span className="text-gray-900">Đã bao gồm</span>
                  </div>
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="flex flex-col items-start gap-1">
                <div className="flex justify-between w-full">
                  <h3 className="text-lg font-semibold">Tổng tiền</h3>
                  <p className="text-xl font-bold text-gray-900 text-right">
                    {formatPrice(bookingDetails.totalPrice)}
                  </p>
                </div>
                <span className="text-xs text-amber-600 font-medium opacity-80">
                  * Chưa bao gồm phụ thu (nếu có)
                </span>
                <div className="mt-2 w-full">
                  <p className="text-sm text-gray-500">
                    Phương thức thanh toán: {" "}
                    <span className="font-medium">
                      {paymentMethod === "credit_card" 
                        ? "Thẻ tín dụng / Ghi nợ" 
                        : paymentMethod === "bank_transfer" 
                          ? "Chuyển khoản ngân hàng" 
                          : "Thanh toán tiền mặt"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component that wraps the content in Suspense
const CheckoutPage: FC = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <CheckoutPageContent />
    </Suspense>
  );
};

export default CheckoutPage;
