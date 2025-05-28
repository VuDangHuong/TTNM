"use client";

import { useState } from "react";
import Image from "next/image";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

import { ChangeEvent, FormEvent } from "react";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset form on success
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (error: unknown) {
      console.error("Form submission error:", error);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <div className="relative h-[40vh] md:h-[50vh]">
        <Image
          src="/images/villa-ngoc-xanh.jpg"
          alt="Ngọc Xanh FLC SẦM SƠN"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-12 lg:p-20">
          <div className="text-white max-w-3xl">
            <p className="text-sm md:text-base font-light mb-2">
              Villa Ngọc Xanh FLC SẦM SƠN - Căn Hộ Nghỉ Dưỡng
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Liên hệ</h1>
            <p className="text-lg md:text-xl max-w-xl">
              Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp mọi thắc mắc của bạn về
              dịch vụ thuê villa tại Ngọc Xanh FLC SẦM SƠN.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-blue-50 p-3 rounded-full mb-4">
              <PhoneIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Điện thoại</h3>
            <p className="text-gray-600 mb-3">
              Liên hệ trực tiếp với chúng tôi
            </p>
            <a
              href="tel:0908506631"
              className="text-blue-600 font-bold text-lg hover:text-blue-700 transition-colors"
            >
              0908.506.631
            </a>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-blue-50 p-3 rounded-full mb-4">
              <EnvelopeIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Email</h3>
            <p className="text-gray-600 mb-3">Gửi yêu cầu qua email</p>
            <a
              href="mailto:hqtuan43c@gmail.com"
              className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
            >
              hqtuan43c@gmail.com
            </a>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-blue-50 p-3 rounded-full mb-4">
              <MapPinIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Địa chỉ</h3>
            <p className="text-gray-600 mb-3">
              Villa Ngọc Xanh, khu nghỉ dưỡng FLC Sầm Sơn
            </p>
            <p className="text-blue-600">Quảng Cư, Sầm Sơn, Thanh Hóa</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="bg-blue-50 p-3 rounded-full mb-4">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Giờ làm việc</h3>
            <p className="text-gray-600 mb-3">Phục vụ mọi lúc mọi nơi</p>
            <p className="text-blue-600">24/7 - Cả ngày lẫn đêm</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-md border border-gray-100 p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Gửi yêu cầu</h2>
              <p className="text-gray-600">
                Hãy điền thông tin của bạn bên dưới, chúng tôi sẽ liên hệ lại
                trong thời gian sớm nhất.
              </p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
                Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm
                nhất.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-2">
                    Chủ đề
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Chọn chủ đề --</option>
                    <option value="booking">Đặt villa</option>
                    <option value="price">Thông tin giá</option>
                    <option value="services">Dịch vụ bổ sung</option>
                    <option value="feedback">Góp ý, phản hồi</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 rounded-md text-white font-medium ${
                  loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } transition-colors flex items-center justify-center`}
              >
                {loading ? (
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
                    Đang gửi...
                  </>
                ) : (
                  "Gửi yêu cầu"
                )}
              </button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 md:p-8 mb-8">
              <div className="flex items-start mb-6">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Liên hệ nhanh qua ứng dụng
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Bạn có thể liên hệ với chúng tôi qua các ứng dụng nhắn tin
                    phổ biến để được phản hồi nhanh chóng.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://zalo.me/0908506631"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <Image
                        src="/zalo-icon.png"
                        alt="Zalo"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      Zalo
                    </a>
                    <a
                      href="https://m.me/VillaSamsonchinhchu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <Image
                        src="/messenger-icon.png"
                        alt="Messenger"
                        width={20}
                        height={20}
                        className="mr-2"
                      />
                      Messenger
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-lg mb-4">
                  Văn phòng đại diện
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Hà Nội:</p>
                      <p className="text-gray-600">
                        99 Khương Thượng, Trung Liệt, Đống Đa, Hà Nội
                      </p>
                      <p className="text-gray-600">
                        Tòa B, chung cư Hateco Hoàng Mai, Yên Sở, Hoàng Mai, Hà
                        Nội
                      </p>
                    </div>
                  </div>
                  {/* <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Thanh Hóa:</p>
                      <p className="text-gray-600">
                        FLC Sầm Sơn, Quảng Tiến, Sầm Sơn, Thanh Hóa
                      </p>
                    </div>
                  </div> */}
                  <div className="flex items-start">
                    <PhoneIcon className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Hotline:</p>
                      <p className="text-gray-600">0908.506.631</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3754.758550577077!2d105.9156325!3d19.7654104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313651005dfbcd31%3A0x741fcc577d61514!2zVmlsbGEgTmfhu41jIFhhbmggU-G6p20gU8ahbg!5e0!3m2!1svi!2s!4v1743354715566!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Câu hỏi thường gặp
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tìm hiểu thêm về dịch vụ thuê villa tại FLC Sầm Sơn qua những câu
              hỏi thường gặp dưới đây.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">
                  Thủ tục đặt villa như thế nào?
                </h3>
                <p className="text-gray-600">
                  Để đặt villa tại FLC Sầm Sơn, bạn có thể liên hệ trực tiếp qua
                  hotline, email hoặc gửi yêu cầu qua form liên hệ. Chúng tôi sẽ
                  xác nhận đặt phòng sau khi bạn thanh toán đặt cọc 50% tổng giá
                  trị.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">
                  Thời gian nhận và trả phòng?
                </h3>
                <p className="text-gray-600">
                  Thời gian nhận phòng (check-in) là 14:00 và thời gian trả
                  phòng (check-out) là 12:00. Nếu bạn muốn nhận phòng sớm hoặc
                  trả phòng muộn, vui lòng liên hệ trước để chúng tôi sắp xếp
                  (có thể phát sinh phí).
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">
                  Có bao gồm bữa sáng không?
                </h3>
                <p className="text-gray-600">
                  Villa không bao gồm bữa sáng. Tuy nhiên, bạn có thể đặt thêm
                  dịch vụ ăn sáng hoặc thuê đầu bếp nấu các bữa ăn tại villa với
                  chi phí phát sinh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
