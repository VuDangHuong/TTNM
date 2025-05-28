'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarIcon, ClockIcon, EyeIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { PublicPost } from '@/services/publicApi';

interface BlogPostContentProps {
  post: PublicPost;
  relatedPosts: PublicPost[];
}

export default function BlogPostContent({ post, relatedPosts }: BlogPostContentProps) {
  const [baseUrl] = useState(() => 
    typeof window !== 'undefined' 
      ? `${window.location.protocol}//${window.location.host}` 
      : 'https://villaflcngocxanh.com'
  );

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM, yyyy', { locale: vi });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Estimate reading time
  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const textContent = content.replace(/<[^>]*>/g, '');
    const wordCount = textContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime > 0 ? readingTime : 1;
  };

  // Extract excerpt from HTML content
  const getExcerpt = (content: string, maxLength: number = 150) => {
    const text = content.replace(/<[^>]*>?/gm, '');
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const pageUrl = `${baseUrl}/bai-viet/${post.slug}`;
  const readingTime = getReadingTime(post.content);

  return (
    <div className="bg-white pt-6 pb-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="max-w-4xl mx-auto mb-4">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex">
              <li className="flex items-center">
                <Link href="/" className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                <span className="mx-2">/</span>
              </li>
              <li className="flex items-center">
                <Link href="/bai-viet" className="hover:text-blue-600 transition-colors">Bài viết</Link>
                <span className="mx-2">/</span>
              </li>
              <li className="text-gray-700 truncate max-w-[200px]" aria-current="page">{post.title}</li>
            </ol>
          </nav>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Post header */}
          <header className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4 mb-6">
              <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-1" aria-hidden="true" />
                <time dateTime={new Date(post.createdAt).toISOString()}>{formatDate(post.createdAt)}</time>
              </div>
              <div className="flex items-center">
                <EyeIcon className="w-4 h-4 mr-1" aria-hidden="true" />
                <span>{post.views} lượt xem</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1" aria-hidden="true" />
                <span>{readingTime} phút đọc</span>
              </div>
            </div>

            {/* Featured image */}
            {post.thumbnail && (
              <div className="relative rounded-lg overflow-hidden mb-8 aspect-[16/9]">
                <Image
                  src={post.thumbnail}
                  alt={`Hình ảnh minh họa cho bài viết: ${post.title}`}
                  fill
                  className="object-cover"
                  priority={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                />
              </div>
            )}
          </header>

          {/* Post content */}
          <article className="prose prose-lg max-w-none mb-10">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Tags and sharing */}
          <div className="border-t border-b border-gray-200 py-4 my-8 flex flex-wrap justify-between items-center">
            {post.seo?.keywords && (
              <div className="mb-4 sm:mb-0">
                <span className="text-sm text-gray-600 mr-2">Tags:</span>
                <div className="inline-flex flex-wrap gap-2">
                  {post.seo.keywords.split(',').map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-block px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-full"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-3">Chia sẻ:</span>
              <div className="flex space-x-2">
                <FacebookShareButton url={pageUrl} title={post.title}>
                  <div className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </div>
                </FacebookShareButton>
                <TwitterShareButton url={pageUrl} title={post.title}>
                  <div className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </div>
                </TwitterShareButton>
              </div>
            </div>
          </div>

          {/* Author info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-10">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Image
                  src="/images/admin-avatar.png"
                  alt="Ảnh đại diện của Admin Villa FLC Sầm Sơn"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Admin</h3>
                <p className="text-gray-600 text-sm">
                  Quản trị viên website Villa FLC Sầm Sơn. Chuyên cung cấp thông tin du lịch và dịch vụ nghỉ dưỡng tại Sầm Sơn.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-4xl mx-auto mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link 
                  href={`/bai-viet/${relatedPost.slug}`} 
                  key={relatedPost._id}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relatedPost.thumbnail || 'https://placehold.co/1280x1024'}
                        alt={`Hình ảnh minh họa cho bài viết: ${relatedPost.title}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                        {getExcerpt(relatedPost.content)}
                      </p>
                      <div className="text-xs text-gray-500 flex items-center mt-auto">
                        <CalendarIcon className="w-4 h-4 mr-1" aria-hidden="true" />
                        {formatDate(relatedPost.createdAt)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to all posts button */}
        <div className="max-w-4xl mx-auto mt-10 text-center">
          <Link
            href="/bai-viet"
            className="inline-flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-1" aria-hidden="true" />
            Xem tất cả bài viết
          </Link>
        </div>
      </div>
    </div>
  );
}