export const dynamic = 'force-dynamic';
import HeroSlider from "@/components/Swiper/swiper";
import SearchForm from "@/components/Search/search";
import WelcomeSection from "@/components/Welcome/welcome";
import VillaListingGrid from "@/components/VillaListingGrid/villaListingGrid";
import Testimonials from "@/components/Testimonials/testimonials";
import LatestNews from "@/components/LatestNews/latestNews";
import VillaLocationMap from "@/components/VillaLocationMap/villaLocationMap";
import { fakeDataService } from "@/services/fakeData";

async function getVillas() {
  try {
    const response = await fakeDataService.getVillas();
    return response.villas || [];
  } catch (error) {
    console.error('Error fetching villas:', error);
    return [];
  }
}

async function getSliders() {
  try {
    const sliders = await fakeDataService.getPublicSliders();
    return sliders;
  } catch (error) {
    console.error('Error fetching sliders:', error);
    return [];
  }
}

async function getPosts() {
  try {
    const posts = await fakeDataService.getLatestPosts(3); // Get latest 3 posts
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

async function getVideos() {
  try {
    const videos = await fakeDataService.getPublicYoutubeVideos(10); // Get up to 10 videos
    return videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

export default async function Home() {
  // Fetch all data in parallel
  const [villas, sliders, posts, videos] = await Promise.all([
    getVillas(),
    getSliders(),
    getPosts(),
    getVideos()
  ]);
  
  return (
    <main className="min-h-screen bg-white">
      <HeroSlider initialSliders={sliders} />
      <SearchForm />
      <WelcomeSection initialVideos={videos} />
      <VillaListingGrid initialVillas={villas} />
      <Testimonials />
      <LatestNews initialPosts={posts} />
      <VillaLocationMap />
    </main>
  );
}
