"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header/header";
import Footer from "@/components/Footer/footer";
import FloatingButtons from "@/components/FloatingButtons/FloatingButtons";
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" type="image/x-icon" />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-G2CKXVGS14"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-G2CKXVGS14');
          `}
        </Script>
        <Script
          id="schema-markup"
          type="application/ld+json"
        >
          {`
            {
              "@context": "https://schema.org",
              "@type": "LodgingBusiness",
              "name": "Villa Ngọc Xanh FLC Sầm Sơn",
              "image": "https://villaflcngocxanh.com/images/villa-ngoc-xanh-social.jpg",
              "description": "Villa Ngọc Xanh FLC Sầm Sơn - Biệt thự nghỉ dưỡng cao cấp tại FLC Sầm Sơn. Không gian sang trọng, view biển tuyệt đẹp, tiện nghi đầy đủ, dịch vụ chuyên nghiệp.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "FLC Sầm Sơn Beach & Golf Resort",
                "addressLocality": "Sầm Sơn",
                "addressRegion": "Thanh Hóa",
                "postalCode": "40000",
                "addressCountry": "VN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "19.7468",
                "longitude": "105.9047"
              },
              "url": "https://villaflcngocxanh.com",
              "telephone": "+84123456789",
              "priceRange": "$$$",
              "amenityFeature": [
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "View biển",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "Bể bơi",
                  "value": true
                },
                {
                  "@type": "LocationFeatureSpecification",
                  "name": "WiFi",
                  "value": true
                }
              ]
            }
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-grow relative">
          {children}
        </main>
        <Footer />
        <FloatingButtons />
      </body>
    </html>
  );
} 