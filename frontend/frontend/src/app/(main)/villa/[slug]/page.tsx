import { fakeDataService, extendVilla } from '@/services/fakeData';
import VillaDetailContent, { ExtendedVilla } from './VillaDetailContent';

type Props = {
  params: { slug: string }
};

interface Amenity {
  name: string;
  available: boolean;
}

interface Review {
  rating: number;
}

export default async function VillaDetailPage({ params }: Props) {
  // Fetch data using fake data service
  const villa = await fakeDataService.getVillaBySlug(params.slug) as ExtendedVilla;
  const similarVillas = await fakeDataService.getSimilarVillas(params.slug) as ExtendedVilla[];
  
  // Extend villa with additional data if needed
  const extendedVilla = extendVilla(villa);
  
  // Convert similar villas to extended villas
  const extendedSimilarVillas = similarVillas.map(v => extendVilla(v));

  // Flatten and type amenities array
  const flattenedAmenities = Object.values(extendedVilla.amenities).flat() as Amenity[];

  // Calculate average rating
  const calculateAverageRating = (reviews: Review[] = []): number => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((acc: number, review: Review) => acc + review.rating, 0) / reviews.length;
  };

  // Generate schema for rich results
  const villaSchema = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: extendedVilla.name,
    description: extendedVilla.description,
    image: extendedVilla.images,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Quảng Cư, Quảng Châu',
      addressLocality: 'Sầm Sơn',
      addressRegion: 'Thanh Hóa',
      postalCode: '440000',
      addressCountry: 'VN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: extendedVilla.location?.latitude || '16.1074',
      longitude: extendedVilla.location?.longitude || '108.2262'
    },
    priceRange: `${extendedVilla.priceByDay[0].price} - ${extendedVilla.priceByDay[extendedVilla.priceByDay.length - 1].price} VND`,
    amenityFeature: flattenedAmenities
      .filter(amenity => amenity.available)
      .map(amenity => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity.name,
        value: true
      })),
    aggregateRating: extendedVilla.reviews && extendedVilla.reviews.length > 0
      ? {
          '@type': 'AggregateRating',
          ratingValue: calculateAverageRating(extendedVilla.reviews),
          reviewCount: extendedVilla.reviews.length
        }
      : undefined
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
        name: 'Villa',
        item: 'https://villaflcngocxanh.com/tim-kiem'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: extendedVilla.name,
        item: `https://villaflcngocxanh.com/villa/${params.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(villaSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <VillaDetailContent villa={extendedVilla} similarVillas={extendedSimilarVillas} />
    </>
  );
}
