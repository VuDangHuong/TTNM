import { useState } from "react";
import Image from "next/image";
import LightboxModal from "./LightboxModal";

interface ImageGalleryProps {
  images: string[];
  villaName: string;
}

const ImageGallery = ({ images, villaName }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const villaImages =
    images.length > 0
      ? images
      : [
          "https://placehold.co/2560x1440/png",
          "https://placehold.co/2560x1440/png",
          "https://placehold.co/2560x1440/png",
          "https://placehold.co/2560x1440/png",
          "https://placehold.co/2560x1440/png",
          "https://placehold.co/2560x1440/png",
          "https://placehold.co/2560x1440/png",
        ];

  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {/* Main large image */}
          <div
            className="md:col-span-2 h-[300px] md:h-[500px] relative cursor-pointer overflow-hidden group"
            onClick={() => openLightbox(selectedImage)}
          >
            <Image
              src={villaImages[selectedImage]}
              alt={villaName}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
              unoptimized={true}
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium shadow-lg">
              Xem tất cả ảnh
            </div>
          </div>

          {/* Side images - Modern Grid Gallery */}
          <div className="hidden md:grid grid-cols-2 gap-1 h-[500px]">
            {villaImages.slice(1, 5).map((image, index) => (
              <div
                key={index + 1}
                className="relative overflow-hidden group cursor-pointer"
                onClick={() => openLightbox(index + 1)}
              >
                <Image
                  src={image}
                  alt={`${villaName} - Image ${index + 2}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized={true}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            ))}
            {villaImages.length > 5 && (
              <div
                className="relative col-span-2 overflow-hidden group cursor-pointer"
                onClick={() => openLightbox(5)}
              >
                <Image
                  src={villaImages[5]}
                  alt="More photos"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized={true}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    + {villaImages.length - 5} ảnh khác
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile image thumbnails */}
        <div className="flex md:hidden overflow-x-auto gap-1 mt-1 pb-2 no-scrollbar">
          {villaImages.map((image, index) => (
            <div
              key={index}
              className={`relative w-20 h-20 flex-shrink-0 rounded overflow-hidden ${
                selectedImage === index ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                unoptimized={true}
              />
            </div>
          ))}
          <div
            className="relative w-20 h-20 flex-shrink-0 bg-black/50 flex items-center justify-center text-white rounded"
            onClick={() => openLightbox(0)}
          >
            Tất cả
          </div>
        </div>
      </div>

      <LightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={villaImages}
        currentIndex={lightboxIndex}
        setCurrentIndex={setLightboxIndex}
      />
    </>
  );
};

export default ImageGallery;
