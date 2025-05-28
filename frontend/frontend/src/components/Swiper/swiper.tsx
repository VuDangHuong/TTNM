"use client"
import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper/modules';
import { PublicSlider } from '@/services/publicApi';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HeroSliderProps {
  initialSliders: PublicSlider[];
}

const HeroSlider = ({ initialSliders }: HeroSliderProps) => {
  // Fallback images in case no sliders
  const fallbackImages = [
    {
      src: "https://placehold.co/2560x1440/png",
      alt: "FLC Sam Son Beach"
    },
    {
      src: "https://placehold.co/2560x1440/png",
      alt: "Villa FLC Sam Son"
    },
    {
      src: "https://placehold.co/2560x1440/png",
      alt: "FLC Sam Son Panorama"
    }
  ];

  // Sort sliders by order
  const sortedSliders = [...initialSliders].sort((a, b) => a.order - b.order);

  // Use API data or fallback if no data
  const images = sortedSliders.length > 0 
    ? sortedSliders.map(slider => ({
        src: slider.imageUrl,
        alt: slider.title
      }))
    : fallbackImages;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
      <Swiper
        cssMode={true}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        mousewheel={true}
        keyboard={true}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        modules={[Navigation, Pagination, Mousewheel, Keyboard, Autoplay]}
        className="mySwiper h-full w-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="relative">
            <div className="relative w-full h-full">
              {/* Overlay gradient for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40 z-10"></div>
              
              {/* Image */}
              <Image
                src={image.src}
                alt={image.alt}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                quality={85}
                loading={index === 0 ? "eager" : "lazy"}
                className="z-0 transition-opacity duration-300"
                onLoadingComplete={(img) => {
                  img.classList.remove('opacity-0');
                  img.classList.add('opacity-100');
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Navigation arrows - custom styling */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white;
          background-color: rgba(0, 0, 0, 0.3);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
        }
        
        .swiper-pagination-bullet {
          background: white;
          opacity: 0.7;
        }
        
        .swiper-pagination-bullet-active {
          background: white;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
