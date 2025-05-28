"use client";

import { FC } from 'react';
import Link from 'next/link';

interface BookingSuccessProps {
  bookingId: string | null;
  customerEmail: string;
}

const BookingSuccessPage: FC<BookingSuccessProps> = ({ bookingId }) => {
  
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">Đặt phòng thành công!</h2>
          <p className="mt-2 text-base text-gray-600">
            Cảm ơn bạn đã đặt phòng. Thông tin chi tiết đã được chúng tôi ghi nhận.
          </p>
          
          <div className="mt-6 border-t border-b border-gray-200 py-4">
            <p className="text-sm text-gray-500 mb-1">Mã đặt phòng của bạn</p>
            <p className="text-xl font-bold text-gray-800">BOOKING-{bookingId}</p>
          </div>
          
          <div className="mt-6 flex flex-col space-y-3">
            <Link 
              href="https://zalo.me/0908506631" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Liên hệ qua Zalo để xác nhận nhanh
            </Link>
            
            <Link 
              href="/" 
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
