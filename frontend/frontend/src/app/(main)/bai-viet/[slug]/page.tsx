import { fakeDataService } from '@/services/fakeData';
import { Metadata } from 'next';
import BlogPostContent from './BlogPostContent';

type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await fakeDataService.getPostBySlug(resolvedParams.slug);
  const excerpt = post.seo?.description || post.content.replace(/<[^>]*>?/gm, '').substring(0, 160);

  return {
    title: `${post.title} | Villa FLC Sầm Sơn`,
    description: excerpt,
    openGraph: {
      title: post.title,
      description: excerpt,
      type: 'article',
      url: `https://villaflcngocxanh.com/bai-viet/${resolvedParams.slug}`,
      images: post.thumbnail ? [{ url: post.thumbnail }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: excerpt,
      images: post.thumbnail ? [post.thumbnail] : [],
    },
  };
}

// Fix the page component to match Next.js expected types
export default async function BlogPost({
  params
}: Props) {
  // Resolve params first
  const resolvedParams = await params;
  
  // Fetch data at server-side
  const post = await fakeDataService.getPostBySlug(resolvedParams.slug);
  const relatedPosts = await fakeDataService.getRelatedPosts(resolvedParams.slug, 3);
  
  // Generate article schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.thumbnail ? [post.thumbnail] : [],
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: 'Admin',
      url: 'https://villaflcngocxanh.com/gioi-thieu'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Villa FLC Sầm Sơn',
      logo: {
        '@type': 'ImageObject',
        url: 'https://villaflcngocxanh.com/images/villa-ngoc-xanh.png'
      }
    },
    description: post.seo?.description || post.content.replace(/<[^>]*>?/gm, '').substring(0, 160),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://villaflcngocxanh.com/bai-viet/${resolvedParams.slug}`
    }
  };

  // Generate breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang chủ',
        item: 'https://villaflcngocxanh.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Bài viết',
        item: 'https://villaflcngocxanh.com/bai-viet'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://villaflcngocxanh.com/bai-viet/${resolvedParams.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <BlogPostContent post={post} relatedPosts={relatedPosts} />
    </>
  );
}