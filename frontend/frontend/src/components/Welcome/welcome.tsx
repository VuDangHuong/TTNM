"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { PlayIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";
import { PublicYoutubeVideo } from "@/services/publicApi";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

interface WelcomeSectionProps {
  initialVideos: PublicYoutubeVideo[];
}

const WelcomeSection = ({ initialVideos }: WelcomeSectionProps) => {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});
  
  const getYoutubeId = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  // Fallback videos in case no videos provided
  const fallbackVideos = useMemo(() => [
    {
      _id: "1",
      title: "FLC Sam Son Beach",
      url: "https://www.youtube.com/watch?v=1uJNpypUnko",
      isActive: true,
      order: 0,
    },
    {
      _id: "2",
      title: "Villa FLC Sam Son",
      url: "https://www.youtube.com/watch?v=B4JXO5xqLd8",
      isActive: true,
      order: 1,
    },
  ], []);

  // Sort videos by order
  const sortedVideos = useMemo(() => {
    const videos = initialVideos.length > 0 ? initialVideos : fallbackVideos;
    return [...videos]
      .sort((a, b) => a.order - b.order)
      .slice(0, 10); // Limit to 10 videos
  }, [initialVideos, fallbackVideos]);

  useEffect(() => {
    const loadThumbnails = async () => {
      const newThumbnails: { [key: string]: string } = {};
      for (const video of sortedVideos) {
        const videoId = getYoutubeId(video.url);
        if (videoId) {
          newThumbnails[
            video._id
          ] = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }
      setThumbnails(newThumbnails);
    };

    if (sortedVideos.length > 0) {
      loadThumbnails();
    }
  }, [sortedVideos]);

  // Dynamic grid layout based on number of videos - more compact
  const getGridLayout = (videoCount: number) => {
    if (videoCount === 1) return "grid-cols-1 max-w-2xl mx-auto";
    if (videoCount === 2) return "grid-cols-2";
    if (videoCount === 3) return "grid-cols-3";
    if (videoCount === 4) return "grid-cols-2 md:grid-cols-4";
    if (videoCount === 5 || videoCount === 6) 
      return "grid-cols-2 md:grid-cols-3";
    if (videoCount <= 9) 
      return "grid-cols-3";
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"; // 10 videos
  };

  // Only feature first video if there are 3-5 videos
  const shouldFeatureFirstVideo = sortedVideos.length >= 3 && sortedVideos.length <= 5;

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Welcome to Ngọc Xanh FLC Sầm Sơn
          </h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto mb-4"></div>
          {/* Description - more compact */}
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Ngọc Xanh FLC Sầm Sơn hân hạnh được cung cấp cho Quý khách hàng
              chuỗi Villa Ngọc Xanh FLC Sầm Sơn chính chủ, thiết kế phong cách hiện đại,
              sang trọng. Khu biệt thự nghỉ dưỡng biệt lập đẳng cấp từ 3* trở lên,
              gần gũi thiên nhiên, nằm tại vị trí đẹp nhất của FLC Luxury Beach
              and Golf Resort.
            </p>
          </div>
        </div>

        {/* "Xem chi tiết" button - more compact */}
        <div className="flex justify-center mb-8">
          <Link
            href="/gioi-thieu"
            className="inline-flex items-center px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-full transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
          >
            <span className="font-medium">Xem chi tiết</span>
            <svg
              className="ml-2 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>

        <div className="space-y-6">
          {/* Featured video layout when applicable - smaller size */}
          {shouldFeatureFirstVideo && sortedVideos.length > 0 && (
            <div className="mb-6 max-w-3xl mx-auto">
              <VideoItem 
                video={sortedVideos[0]} 
                videoId={getYoutubeId(sortedVideos[0].url)} 
                thumbnail={thumbnails[sortedVideos[0]._id]} 
                playingVideoId={playingVideoId}
                setPlayingVideoId={setPlayingVideoId}
                isFeatured={true}
              />
            </div>
          )}
          
          {/* Regular grid for remaining videos - more compact with smaller gap */}
          <div 
            className={`grid gap-3 md:gap-4 ${
              shouldFeatureFirstVideo
                ? getGridLayout(sortedVideos.length - 1)
                : getGridLayout(sortedVideos.length)
            }`}
          >
            {sortedVideos.slice(shouldFeatureFirstVideo ? 1 : 0).map((video) => {
              const videoId = getYoutubeId(video.url);
              return (
                <VideoItem 
                  key={video._id}
                  video={video} 
                  videoId={videoId} 
                  thumbnail={thumbnails[video._id]} 
                  playingVideoId={playingVideoId}
                  setPlayingVideoId={setPlayingVideoId}
                  isFeatured={false}
                />
              );
            })}
          </div>
        </div>

        {/* Video description - more compact */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-xs italic">
            Trải nghiệm không gian sang trọng và dịch vụ đẳng cấp tại Villa Ngọc Xanh FLC Sầm Sơn
          </p>
        </div>
      </div>
    </section>
  );
};

// Extracted video item component for reusability - more compact
interface VideoItemProps {
  video: PublicYoutubeVideo;
  videoId: string | null;
  thumbnail: string;
  playingVideoId: string | null;
  setPlayingVideoId: (videoId: string | null) => void;
  isFeatured: boolean;
}

const VideoItem = ({
  video,
  videoId,
  thumbnail,
  playingVideoId,
  setPlayingVideoId,
  isFeatured
}: VideoItemProps) => {
  return (
    <div
      className={`relative rounded-lg overflow-hidden shadow-md group transition-all duration-300 hover:shadow-lg`}
    >
      <div
        className="relative w-full"
        style={{ paddingTop: "56.25%" }}
      >
        {playingVideoId === videoId ? (
          <div className="absolute top-0 left-0 w-full h-full">
            <ReactPlayer
              url={video.url}
              width="100%"
              height="100%"
              playing={true}
              controls={true}
              onEnded={() => setPlayingVideoId(null)}
              onPlay={() => setPlayingVideoId(videoId)}
              playsinline={true}
              config={{
                youtube: {
                  playerVars: {
                    showinfo: 1,
                    playsinline: 1,
                    modestbranding: 1,
                    origin:
                      typeof window !== "undefined"
                        ? window.location.origin
                        : "",
                  },
                },
              }}
            />
          </div>
        ) : (
          <div className="absolute top-0 left-0 w-full h-full">
            {videoId && (
              <Image
                src={thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={video.title}
                fill
                sizes={isFeatured ? "100vw" : "(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src.includes("maxresdefault")) {
                    target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                  } else if (target.src.includes("hqdefault")) {
                    target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                  } else {
                    target.src = `https://img.youtube.com/vi/${videoId}/default.jpg`;
                  }
                }}
              />
            )}

            {/* Video overlay with title - smaller elements */}
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center transition-opacity duration-300 group-hover:bg-black/40">
              <button
                className="flex items-center justify-center cursor-pointer transform transition-all duration-300 group-hover:scale-110"
                onClick={() => setPlayingVideoId(videoId)}
                aria-label={`Play ${video.title} video`}
              >
                <div className={`bg-white/90 rounded-full ${isFeatured ? 'p-3' : 'p-2'} shadow-md`}>
                  <PlayIcon className={`${isFeatured ? 'h-8 w-8' : 'h-5 w-5 sm:h-6 sm:w-6'} text-blue-600`} />
                </div>
              </button>
              
              {/* Show title in a smaller font */}
              <div className="text-white font-medium mt-2 text-center px-2 py-1 bg-black/50 rounded text-xs max-w-[90%] line-clamp-1">
                {video.title || "Ngọc Xanh FLC Sầm Sơn"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeSection;
