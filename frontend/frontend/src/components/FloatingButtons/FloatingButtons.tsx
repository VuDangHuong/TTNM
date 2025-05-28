'use client';

import { useState, useEffect } from 'react';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileFormExpanded, setIsMobileFormExpanded] = useState(false);

  // Kiểm tra thiết bị mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Theo dõi scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theo dõi trạng thái của MobileBookingBar
  useEffect(() => {
    const checkMobileFormExpanded = () => {
      // Tìm phần tử overlay của MobileBookingBar
      const overlay = document.querySelector('.fixed.inset-0.bg-black\\/40.backdrop-blur-sm.z-20');
      setIsMobileFormExpanded(!!overlay);
    };

    // Kiểm tra ban đầu
    checkMobileFormExpanded();

    // Thiết lập MutationObserver để theo dõi thay đổi DOM
    const observer = new MutationObserver(checkMobileFormExpanded);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Mở Zalo
  const openZalo = () => {
    window.open('https://zalo.me/0908506631', '_blank');
  };

  // Nếu form mobile đang mở rộng và đang ở thiết bị mobile, ẩn các nút
  if (isMobileFormExpanded && isMobile) {
    return null;
  }

  return (
    <div className={`fixed ${isMobile ? 'bottom-20' : 'bottom-6'} right-6 z-40 flex flex-col items-end gap-4`}>
      {/* Zalo Button */}
      <button
        onClick={openZalo}
        className="bg-white hover:bg-gray-100 p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200"
        aria-label="Liên hệ qua Zalo"
      >
        <Image 
          src="/zalo-icon.png" 
          alt="Zalo" 
          width={30} 
          height={30} 
          className="rounded-full"
        />
      </button>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="bg-white hover:bg-gray-100 text-blue-600 p-2 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200"
          aria-label="Cuộn lên đầu trang"
        >
          <ArrowUpCircleIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default FloatingButtons;
