import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Giới Thiệu Villa FLC Sầm Sơn - Ngọc Xanh Villa Nghỉ Dưỡng Cao Cấp',
  description: 'Khám phá Villa FLC Sầm Sơn - Ngọc Xanh Villa với 16 phòng ngủ, bể bơi riêng và đầy đủ tiện nghi. Nằm trong khu nghỉ dưỡng FLC Sầm Sơn 5 sao, cách bãi biển riêng chỉ 500m.',
  alternates: {
    canonical: 'https://villaflcngocxanh.com/gioi-thieu',
  },
  openGraph: {
    title: 'Giới Thiệu Villa FLC Sầm Sơn - Ngọc Xanh Villa Nghỉ Dưỡng Cao Cấp',
    description: 'Khám phá Villa FLC Sầm Sơn - Ngọc Xanh Villa với 16 phòng ngủ, bể bơi riêng và đầy đủ tiện nghi. Nằm trong khu nghỉ dưỡng FLC Sầm Sơn 5 sao, cách bãi biển riêng chỉ 500m.',
    url: 'https://villaflcngocxanh.com/gioi-thieu',
    siteName: 'Villa FLC Sầm Sơn',
    images: [
      {
        url: 'https://villaflcngocxanh.com/images/villa-ngoc-xanh.jpg',
        width: 1200,
        height: 630,
        alt: 'Villa FLC Sầm Sơn - Ngọc Xanh Villa',
      },
    ],
    type: 'website',
  },
};

export default function GioiThieuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    // FAQ
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Ngọc Xanh Villa có bao nhiêu phòng ngủ?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ngọc Xanh Villa 02 & 03 có 16 phòng ngủ rộng rãi, đầy đủ tiện nghi, phù hợp cho các đoàn khách lớn hoặc gia đình đông thành viên.',
          },
        },
        {
          '@type': 'Question',
          name: 'Villa FLC Sầm Sơn có bể bơi riêng không?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Có, Ngọc Xanh Villa có bể bơi chung rộng 60m², ngoài ra còn có thể sử dụng bể bơi nước mặn lớn nhất Việt Nam trong khuôn viên FLC Sầm Sơn.',
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
        {
          '@type': 'Question',
          name: 'Villa FLC Sầm Sơn có những tiện ích gì?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Villa FLC Sầm Sơn có nhiều tiện ích như phòng khách rộng, phòng bếp đầy đủ dụng cụ nấu ăn, sân vườn, khu BBQ, không gian tổ chức tiệc, dịch vụ dọn dẹp hàng ngày và kết nối với các dịch vụ giải trí, mua sắm trong khu resort.',
          },
        },
        {
          '@type': 'Question',
          name: 'Có thể tổ chức sự kiện tại villa không?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Có, villa hỗ trợ tổ chức tiệc gia đình và sự kiện nhỏ. Đối với các sự kiện lớn hơn, có thể kết nối với trung tâm hội nghị quốc tế FLC với sức chứa lên đến 1.300 khách.',
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
          name: 'Giới thiệu',
          item: 'https://villaflcngocxanh.com/gioi-thieu',
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
      {children}
    </>
  );
}