import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên Hệ - Villa FLC Sầm Sơn',
  description: 'Liên hệ với chúng tôi để đặt phòng villa FLC Sầm Sơn. Đội ngũ tư vấn chuyên nghiệp, nhiệt tình sẽ hỗ trợ bạn 24/7.',
  alternates: {
    canonical: 'https://villaflcngocxanh.com/lien-he',
  },
  openGraph: {
    title: 'Liên Hệ - Villa FLC Sầm Sơn',
    description: 'Liên hệ với chúng tôi để đặt phòng villa FLC Sầm Sơn. Đội ngũ tư vấn chuyên nghiệp, nhiệt tình sẽ hỗ trợ bạn 24/7.',
    url: 'https://villaflcngocxanh.com/lien-he',
    siteName: 'Villa FLC Sầm Sơn',
    images: [
      {
        url: 'https://villaflcngocxanh.com/images/villa-ngoc-xanh.jpg',
        width: 1200,
        height: 630,
        alt: 'Liên hệ Villa FLC Sầm Sơn',
      },
    ],
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    // Organization
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://villaflcngocxanh.com',
      name: 'Villa FLC Sầm Sơn',
      url: 'https://villaflcngocxanh.com',
      logo: 'https://villaflcngocxanh.com/images/villa-ngoc-xanh.jpg',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+84908506631',
        contactType: 'customer service',
        areaServed: 'VN',
        availableLanguage: ['Vietnamese', 'English'],
      },
      sameAs: [
        'https://www.facebook.com/villaflcsamson',
        'https://www.instagram.com/villaflcsamson',
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
          name: 'Liên hệ',
          item: 'https://villaflcngocxanh.com/lien-he',
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumb) }}
      />
      {children}
    </>
  );
}