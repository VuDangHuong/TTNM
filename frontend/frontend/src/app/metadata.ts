import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL('https://villaflcngocxanh.com'),
  title: {
    default: "Villa Ngọc Xanh FLC Sầm Sơn | Biệt thự nghỉ dưỡng cao cấp",
    template: "%s | Villa Ngọc Xanh FLC Sầm Sơn"
  },
  description: "Villa Ngọc Xanh FLC Sầm Sơn - Biệt thự nghỉ dưỡng cao cấp tại FLC Sầm Sơn. Không gian sang trọng, view biển tuyệt đẹp, tiện nghi đầy đủ, dịch vụ chuyên nghiệp.",
  keywords: ["villa ngọc xanh", "flc sầm sơn", "biệt thự nghỉ dưỡng", "villa flc sầm sơn", "villa view biển", "villa cao cấp sầm sơn"],
  authors: [{ name: 'Villa Ngọc Xanh' }],
  creator: 'Villa Ngọc Xanh',
  publisher: 'Villa Ngọc Xanh',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Villa Ngọc Xanh FLC Sầm Sơn | Biệt thự nghỉ dưỡng cao cấp',
    description: 'Villa Ngọc Xanh FLC Sầm Sơn - Biệt thự nghỉ dưỡng cao cấp tại FLC Sầm Sơn. Không gian sang trọng, view biển tuyệt đẹp, tiện nghi đầy đủ, dịch vụ chuyên nghiệp.',
    url: '/',
    siteName: 'Villa Ngọc Xanh',
    images: [
      {
        url: '/images/villa-ngoc-xanh.jpg',
        width: 1200,
        height: 630,
        alt: 'Villa Ngọc Xanh FLC Sầm Sơn',
      }
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Villa Ngọc Xanh FLC Sầm Sơn | Biệt thự nghỉ dưỡng cao cấp',
    description: 'Villa Ngọc Xanh FLC Sầm Sơn - Biệt thự nghỉ dưỡng cao cấp tại FLC Sầm Sơn. Không gian sang trọng, view biển tuyệt đẹp, tiện nghi đầy đủ, dịch vụ chuyên nghiệp.',
    images: ['/images/villa-ngoc-xanh.jpg'],
  },
}; 