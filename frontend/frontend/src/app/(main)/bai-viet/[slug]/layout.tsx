import { Metadata } from 'next';
import { fakeDataService } from '@/services/fakeData';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

// Define a proper interface for the post object
interface Post {
  title: string;
  content: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt?: string;
  seo?: {
    description?: string;
    keywords?: string;
  };
}

// Helper function
function getExcerpt(content: string, maxLength: number = 150) {
  const text = content.replace(/<[^>]*>?/gm, '');
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Hàm tạo JSON-LD cho bài viết
function generateArticleSchema(post: Post, slug: string, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.thumbnail ? [post.thumbnail] : [],
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: 'Admin',
      url: `${baseUrl}/gioi-thieu`
    },
    publisher: {
      '@type': 'Organization',
      name: 'Villa FLC Sầm Sơn',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/villa-ngoc-xanh.jpg`
      }
    },
    description: post.seo?.description || getExcerpt(post.content, 160),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/bai-viet/${slug}`
    }
  };
}

// Hàm tạo JSON-LD cho breadcrumbs
function generateBreadcrumbSchema(post: Post, slug: string, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: `${baseUrl}/`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Bài viết',
        item: `${baseUrl}/bai-viet`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${baseUrl}/bai-viet/${slug}`
      }
    ]
  };
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    // Lấy dữ liệu bài viết từ fakeDataService
    const post = await fakeDataService.getPostBySlug(slug);
    
    if (!post) {
      return {
        title: 'Không tìm thấy bài viết | Villa FLC Sầm Sơn',
        description: 'Bài viết không tồn tại hoặc đã bị xóa.',
      };
    }
    
    const postExcerpt = post.seo?.description || getExcerpt(post.content, 160);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://villaflcsamson.com';
    
    return {
      title: `${post.title} | Villa FLC Sầm Sơn`,
      description: postExcerpt,
      keywords: post.seo?.keywords,
      openGraph: {
        title: post.title,
        description: postExcerpt,
        type: 'article',
        url: `${baseUrl}/bai-viet/${slug}`,
        images: post.thumbnail ? [{ url: post.thumbnail }] : [],
        siteName: 'Villa FLC Sầm Sơn',
        publishedTime: post.createdAt,
        modifiedTime: post.updatedAt || post.createdAt,
        authors: ['Admin'],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: postExcerpt,
        images: post.thumbnail ? [post.thumbnail] : [],
      },
      alternates: {
        canonical: `${baseUrl}/bai-viet/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Bài viết | Villa FLC Sầm Sơn',
      description: 'Đọc các bài viết mới nhất về du lịch và nghỉ dưỡng tại Sầm Sơn.',
    };
  }
}

export default async function BlogPostLayout({
  children,
  params
}: LayoutProps) {
  let articleSchema = null;
  let breadcrumbSchema = null;

  try {
    const resolvedParams = await params;
    const post = await fakeDataService.getPostBySlug(resolvedParams.slug);
    
    if (post) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://villaflcsamson.com';
      articleSchema = generateArticleSchema(post, resolvedParams.slug, baseUrl);
      breadcrumbSchema = generateBreadcrumbSchema(post, resolvedParams.slug, baseUrl);
    }
  } catch (error) {
    console.error('Error generating JSON-LD:', error);
  }

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      )}
      
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />
      )}
      
      {children}
    </>
  );
}