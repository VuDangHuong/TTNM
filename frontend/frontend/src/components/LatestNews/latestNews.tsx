"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicPost } from "@/services/publicApi";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, UserIcon, ArrowRightIcon, NewspaperIcon } from "@heroicons/react/24/outline";

interface LatestNewsProps {
  initialPosts: PublicPost[];
}

const LatestNews = ({ initialPosts }: LatestNewsProps) => {
  // Format date function
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMMM, yyyy", { locale: vi });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Extract excerpt from HTML content
  const getExcerpt = (content: string, maxLength: number = 120) => {
    // Remove HTML tags
    const text = content.replace(/<[^>]*>?/gm, '');
    // Truncate to maxLength
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Handle image error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://placehold.co/800x600/e2e8f0/64748b?text=FLC+Ngọc+Xanh";
  };

  // If no articles, don't show the section
  if (initialPosts.length === 0) {
    return null;
  }

  // Determine layout based on number of articles
  const getGridClass = () => {
    switch (initialPosts.length) {
      case 1:
        return "grid-cols-1 max-w-2xl mx-auto";
      case 2:
        return "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto";
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Tin tức mới nhất
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
          {initialPosts.length < 3 && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cập nhật những thông tin mới nhất về FLC Ngọc Xanh Sầm Sơn và các sự kiện đặc biệt
            </p>
          )}
        </div>

        <div className={`grid ${getGridClass()} gap-8`}>
          {initialPosts.map((article) => (
            <div 
              key={article._id} 
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <Link href={`/bai-viet/${article.slug}`} className="h-full flex flex-col">
                {/* Article Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={article.thumbnail || 'https://placehold.co/800x600/e2e8f0/64748b?text=FLC+Ngọc+Xanh'}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={handleImageError}
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-70"></div>
                  
                  {/* Date overlay */}
                  <div className="absolute bottom-4 left-4 text-white flex items-center text-sm bg-black/40 px-3 py-1 rounded-full">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                    {getExcerpt(article.content)}
                  </p>
                  
                  {/* Read more link */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-xs">
                      <UserIcon className="h-4 w-4 mr-1" />
                      <span>Admin</span>
                    </div>
                    
                    <span className="text-blue-600 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform">
                      Đọc tiếp
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* "View all" button with improved styling */}
        <div className="text-center mt-12">
          <Link 
            href="/bai-viet"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <NewspaperIcon className="h-5 w-5 mr-2" />
            <span className="font-medium">Xem tất cả bài viết</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNews;
