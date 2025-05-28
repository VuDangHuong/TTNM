export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { fakeDataService } from "@/services/fakeData";
import SearchContent from './SearchContent';

export const metadata: Metadata = {
  title: 'Tìm kiếm Villa | FLC Sầm Sơn',
  description: 'Tìm kiếm villa phù hợp tại FLC Sầm Sơn với các tiêu chí về giá, số lượng khách, số phòng ngủ.',
  openGraph: {
    title: 'Tìm kiếm Villa | FLC Sầm Sơn',
    description: 'Tìm kiếm villa phù hợp tại FLC Sầm Sơn với các tiêu chí về giá, số lượng khách, số phòng ngủ.',
    type: 'website',
    url: 'https://villaflcngocxanh.com/tim-kiem',
  },
};

// Hàm fetch dữ liệu từ server
async function getInitialVillas() {
  try {
    const villas = await fakeDataService.searchVillas({});
    return villas as unknown as any; // Type cast to avoid type issues
  } catch (error) {
    console.error('Error fetching initial villas:', error);
    return [];
  }
}

export default async function SearchPage() {
  // Fetch dữ liệu ban đầu tại server
  const initialVillas = await getInitialVillas();

  return <SearchContent initialVillas={initialVillas} />;
}
