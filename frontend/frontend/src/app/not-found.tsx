"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      window.location.href = "/";
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      {/* Graphic Element */}
      <div className="relative w-full max-w-md h-64 mb-8">
        <Image
          src="/images/404-illustration.svg" // Thay thế bằng đường dẫn thực tế
          alt="Page not found illustration"
          fill
          priority
          className="object-contain"
        />
        {/* Fallback nếu không có hình ảnh */}
        <div className="absolute inset-0 flex items-center justify-center text-9xl font-bold text-blue-900/10 z-[-1]">
          404
        </div>
      </div>

      {/* Content */}
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Không tìm thấy trang!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        {/* Suggestions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Bạn có thể thử:
          </h2>
          <ul className="text-left text-gray-600 space-y-3">
            <li className="flex items-start">
              <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 mr-3 items-center justify-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>
              <span>Kiểm tra lại đường dẫn URL</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 mr-3 items-center justify-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>
              <span>Quay lại trang trước đó</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 mr-3 items-center justify-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>
              <span>Truy cập trang chủ</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 mr-3 items-center justify-center text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </span>
              <span>Liên hệ với chúng tôi nếu bạn tin rằng đây là lỗi</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <HomeIcon className="h-5 w-5" />
            <span>Về trang chủ</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Quay lại</span>
          </button>
        </div>

        {/* Auto Redirect Notice */}
        <p className="text-sm text-gray-500 mt-8">
          Tự động chuyển hướng về trang chủ sau{" "}
          <span className="font-medium text-blue-600">{countdown}</span> giây
        </p>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <p className="text-gray-500 text-sm">
          Bạn cần hỗ trợ? Vui lòng{" "}
          <Link href="/lien-he" className="text-blue-600 hover:underline">
            liên hệ với chúng tôi
          </Link>
        </p>
      </div>
    </div>
  );
}
