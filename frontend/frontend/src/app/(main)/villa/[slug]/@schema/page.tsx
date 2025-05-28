// app/villa/[slug]/@schema/page.tsx
import React from 'react';

export default function SchemaMarkup({
  params,
}: {
  params: { slug: string };
}) {
  const villaName = params.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const jsonLd = {
    // FAQ
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Villa có bao nhiêu phòng ngủ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Villa có 16 phòng ngủ rộng rãi, đầy đủ tiện nghi, phù hợp cho các đoàn khách lớn hoặc gia đình đông thành viên.',
          },
        },
        {
          '@type': 'Question',
          name: 'Villa có những tiện ích gì?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Villa có bể bơi riêng, phòng khách rộng, phòng bếp đầy đủ dụng cụ nấu ăn, sân vườn, khu BBQ, không gian tổ chức tiệc và dịch vụ dọn dẹp hàng ngày.',
          },
        },
        {
          '@type': 'Question',
          name: 'Khoảng cách từ villa đến bãi biển là bao xa?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Villa cách bãi tắm riêng khoảng 500m, du khách có thể dễ dàng di chuyển đến bãi biển bằng đi bộ hoặc xe điện buggy.',
          },
        },
      ],
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
          name: 'Villa',
          item: 'https://villaflcngocxanh.com/tim-kiem',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: villaName,
          item: `https://villaflcngocxanh.com/villa/${params.slug}`,
        },
      ],
    },
    // Local Business
    localBusiness: {
      '@context': 'https://schema.org',
      '@type': 'LodgingBusiness',
      '@id': 'https://villaflcngocxanh.com',
      name: 'Villa FLC Sầm Sơn - Ngọc Xanh Villa',
      description: 'Biệt thự nghỉ dưỡng cao cấp tại FLC Sầm Sơn với 16 phòng ngủ, bể bơi riêng và đầy đủ tiện nghi.',
      url: 'https://villaflcngocxanh.com',
      telephone: '+84908506631',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Khu FLC Sầm Sơn',
        addressLocality: 'Sầm Sơn',
        addressRegion: 'Thanh Hóa',
        postalCode: '440000',
        addressCountry: 'VN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '19.738968',
        longitude: '105.902672',
      },
      image: [
        'https://villaflcngocxanh.com/images/villa-ngoc-xanh.jpg',
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '5',
        ratingCount: '2',
      },
      priceRange: '$$$',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.localBusiness) }}
      />
    </>
  );
}