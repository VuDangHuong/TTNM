/* eslint-disable @typescript-eslint/no-unused-vars */
import { Metadata } from 'next';
import React from 'react';
import { fakeDataService } from '@/services/fakeData';
import { cache } from 'react';

// Cache the villa name fetch to avoid duplicate API calls
const getVillaName = cache(async (slug: string): Promise<string> => {
  try {
    const villa = await fakeDataService.getVillaBySlug(slug);
    return villa.name;
  } catch (error) {
    console.error(`Error fetching villa name for slug ${slug}:`, error);
    // Fallback to a formatted version of the slug if API fails
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  // Lấy và cache tên villa
  const villaName = await getVillaName(params.slug);

  const title = `${villaName} - Villa FLC Sầm Sơn`;
  const description = `Khám phá ${villaName} với 16 phòng ngủ, bể bơi riêng và đầy đủ tiện nghi. Nằm trong khu nghỉ dưỡng FLC Sầm Sơn 5 sao, cách bãi biển riêng chỉ 500m.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://villaflcngocxanh.com/villa/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://villaflcngocxanh.com/villa/${params.slug}`,
      siteName: 'Villa FLC Sầm Sơn',
      images: [
        {
          url: 'https://villaflcngocxanh.com/images/villa-ngoc-xanh.jpg',
          width: 1200,
          height: 630,
          alt: `Villa ${villaName} - FLC Sầm Sơn`,
        },
      ],
      type: 'website',
    },
  };
}

export default function Layout({
  children,
  schema, // This is a parallel route slot
  params,
}: {
  children: React.ReactNode;
  schema: React.ReactNode;
  params: { slug: string };
}) {
  return (
    <>
      {schema}
      {children}
    </>
  );
}