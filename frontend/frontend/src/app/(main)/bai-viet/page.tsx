export const dynamic = 'force-dynamic';
import BlogGrid from "./BlogGrid";
import { Metadata } from "next";
import { fakeDataService } from "@/services/fakeData";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Danh sách bài viết | FLC Sầm Sơn",
  description: "Khám phá những bài viết hữu ích về du lịch, ẩm thực và kinh nghiệm nghỉ dưỡng tại FLC Sầm Sơn.",
  openGraph: {
    title: "Danh sách bài viết | FLC Sầm Sơn",
    description: "Khám phá những bài viết hữu ích về du lịch, ẩm thực và kinh nghiệm nghỉ dưỡng tại FLC Sầm Sơn.",
    url: "https://villaflcngocxanh.com/bai-viet",
    type: "website",
  },
};

export default async function Page() {
  const data = await fakeDataService.getPublicPosts(1, 12);

  return (
    <>
      <Script
        id="json-ld-blog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "url": "https://villaflcngocxanh.com/bai-viet",
            "author": {
              "@type": "Person",
              "name": "FLC Sầm Sơn Blog",
            },
            "description": metadata.description,
            "article": data.posts.map((post) => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "author": { "@type": "Person", "name": "Admin" },
              "datePublished": post.createdAt,
              "url": `https://villaflcngocxanh.com/bai-viet/${post.slug}`,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://villaflcngocxanh.com/bai-viet/${post.slug}`,
              },
            })),
          }),
        }}
      />
      
      {/* Render Blog Grid */}
      <BlogGrid initialPosts={data.posts} totalPages={data.pages} />
    </>
  );
}