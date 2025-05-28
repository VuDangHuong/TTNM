"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const testimonials = [
    {
      id: 1,
      name: "TRẦN DIỆU LINH",
      avatar: "/images/danh-gia-khach-tran-dieu-linh.jpg",
      text: "Dịch vụ tốt, khá ưng ý, sẽ quay lại lần sau.",
    },
    {
      id: 2,
      name: "LÊ MINH HUYỀN",
      avatar: "/images/danh-gia-khach-dat-villa.jpg",
      text: "Villa rất đẹp và sạch sẽ, nhân viên phục vụ chu đáo.",
    },
    {
      id: 3,
      name: "VŨ NGÂN GIANG",
      avatar: "/images/vu-ngan-giang-khach-dat-phong.jpg",
      text: "Không gian tuyệt vời, phù hợp cho gia đình đông người.",
    },
    {
      id: 4,
      name: "TRANG ĐÀO",
      avatar: "/images/khach-hang-dat-villa.jpg",
      text: "Vị trí đẹp, gần biển, thuận tiện đi lại.",
    },
    {
      id: 5,
      name: "ĐOÀN BÌNH",
      avatar: "/images/y-kien-khach-dat-villa.jpg",
      text: "Đặt phòng dễ dàng, giá cả hợp lý cho chất lượng nhận được.",
    },
    {
      id: 6,
      name: "VIÊN THỊ SÁNG",
      avatar: "/images/khach-hang-noi-ve-villa-flc.jpg",
      text: "Đặt phòng dễ dàng, giá cả hợp lý cho chất lượng nhận được.",
    },
  ];

  return (
    <div 
      className="relative py-20 px-4 bg-cover bg-center bg-no-repeat text-white"
      style={{ 
        backgroundImage: "url('/images/bg-testimonial.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}  
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Khách hàng nói gì về chúng tôi?</h2>
          
          {/* Avatar Swiper */}
          <div className="max-w-md mx-auto mb-8">
            <Swiper
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              modules={[Navigation, Pagination]}
              slidesPerView={5}
              centeredSlides={true}
              spaceBetween={10}
              initialSlide={0}
              loop={true}
              onSlideChange={(swiper) => setActiveTestimonial(swiper.realIndex)}
              className="testimonial-avatar-swiper"
            >
              {testimonials.map((testimonial, index) => (
                <SwiperSlide key={testimonial.id}>
                  <div 
                    className={`relative cursor-pointer transition-all duration-300 ${
                      activeTestimonial === index 
                        ? 'scale-100 opacity-100' 
                        : 'scale-80 opacity-70'
                    }`}
                    onClick={() => {
                      if (swiperRef.current) {
                        swiperRef.current.slideToLoop(index);
                      }
                    }}
                  >
                    <div className={`
                      w-16 h-16 mx-auto rounded-full overflow-hidden border-2
                      ${activeTestimonial === index ? 'border-blue-400' : 'border-transparent'}
                    `}>
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          
          {/* Testimonial Text */}
          <div className="max-w-2xl mx-auto relative">
            <span className="text-blue-400 text-6xl font-serif absolute -top-8 left-0">&ldquo;</span>
            <div className="px-12">
              <p className="text-lg italic mb-4">
                {testimonials[activeTestimonial].text}
              </p>
              <p className="font-bold tracking-wider">
                {testimonials[activeTestimonial].name}
              </p>
            </div>
            <span className="text-blue-400 text-6xl font-serif absolute -bottom-12 right-0">&rdquo;</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
