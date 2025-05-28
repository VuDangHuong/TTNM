import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tìm Kiếm Villa FLC Sầm Sơn',
  description: 'Tìm kiếm và đặt phòng villa FLC Sầm Sơn. Đa dạng lựa chọn villa với đầy đủ tiện nghi, view biển đẹp, giá tốt nhất.',
  alternates: {
    canonical: 'https://villaflcngocxanh.com/tim-kiem',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  openGraph: {
    title: 'Tìm Kiếm Villa FLC Sầm Sơn',
    description: 'Tìm kiếm và đặt phòng villa FLC Sầm Sơn. Đa dạng lựa chọn villa với đầy đủ tiện nghi, view biển đẹp, giá tốt nhất.',
    url: 'https://villaflcngocxanh.com/tim-kiem',
    siteName: 'Villa FLC Sầm Sơn',
    images: [
      {
        url: 'https://villaflcngocxanh.com/images/villa-ngoc-xanh.jpg',
        width: 1200,
        height: 630,
        alt: 'Tìm kiếm Villa FLC Sầm Sơn',
      },
    ],
    type: 'website',
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    // WebSite schema with SearchAction
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': 'https://villaflcngocxanh.com/#website',
      url: 'https://villaflcngocxanh.com',
      name: 'Villa FLC Sầm Sơn',
      description: 'Đặt phòng villa FLC Sầm Sơn - View biển, tiện nghi cao cấp',
      potentialAction: [
        {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://villaflcngocxanh.com/tim-kiem?q={search_term_string}'
          },
          'query-input': 'required name=search_term_string'
        }
      ]
    },
    // Breadcrumb
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Trang chủ',
          item: 'https://villaflcngocxanh.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Tìm kiếm',
          item: 'https://villaflcngocxanh.com/tim-kiem',
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumb) }}
      />
      {children}
    </>
  );
}