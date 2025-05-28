"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { CalendarIcon, EyeIcon } from "@heroicons/react/24/outline";
import { PublicPost } from "@/services/publicApi";
import { fakeDataService } from "@/services/fakeData";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const BlogGrid = ({ initialPosts, totalPages }: { initialPosts: PublicPost[], totalPages: number }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await fakeDataService.getPublicPosts(currentPage, 12);
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentPage !== 1) fetchPosts();
  }, [currentPage]);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // Format date function
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Extract excerpt from HTML content
  const getExcerpt = (content: string, maxLength: number = 150) => {
    // Remove HTML tags
    const text = content.replace(/<[^>]*>?/gm, '');
    // Truncate to maxLength
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Bài Viết</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Khám phá những bài viết hữu ích về du lịch, ẩm thực và kinh nghiệm nghỉ dưỡng tại FLC Sầm Sơn.
          </p>
        </div>

        {posts.length === 0 && !loading ? (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-600">Chưa có bài viết nào.</h3>
            <p className="text-gray-500 mt-2">Vui lòng quay lại sau.</p>
          </div>
        ) : (
          <>
            {/* Article Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.map((post) => (
                <div key={post._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <Link href={`/bai-viet/${post.slug}`} as={`/bai-viet/${post.slug}`} className="block">
                    <div className="relative h-48 overflow-hidden">
                      {post.seo?.keywords && (
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-medium px-2 py-1 z-10">
                          {post.seo.keywords.split(',')[0]}
                        </div>
                      )}
                      <Image
                        src={post.thumbnail || 'https://placehold.co/2560x1440/png'}
                        alt={`Ảnh minh họa cho bài viết: ${post.title}`}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 h-14">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                        {getExcerpt(post.content)}
                      </p>
                      <div className="flex items-center justify-between text-gray-500 text-xs">
                        <div className="flex items-center">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          <span>{post.views} lượt xem</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center justify-center w-10 h-10 rounded-l-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-500"
                    } border border-gray-200`}
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  
                  <div className="hidden md:flex">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                      // Show limited page numbers with ellipsis
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`w-10 h-10 ${
                              currentPage === pageNumber
                                ? "bg-blue-500 text-white font-medium"
                                : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-500"
                            } border-t border-b border-gray-200`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        (pageNumber === currentPage - 2 && pageNumber > 1) ||
                        (pageNumber === currentPage + 2 && pageNumber < totalPages)
                      ) {
                        return (
                          <span
                            key={pageNumber}
                            className="w-10 h-10 flex items-center justify-center border-t border-b border-gray-200"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>
                  
                  {/* Mobile pagination - just show current/total */}
                  <div className="flex md:hidden">
                    <span className="w-auto px-4 h-10 flex items-center justify-center border-t border-b border-gray-200 bg-white">
                      {currentPage} / {totalPages}
                    </span>
                  </div>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center justify-center w-10 h-10 rounded-r-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-500"
                    } border border-gray-200`}
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogGrid;