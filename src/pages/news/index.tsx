import Link from "next/link";
import { GetStaticProps } from "next";
import { getSortedPostsData } from "../../lib/posts";
import NewsCard from "@/components/NewsCard";
import { config } from "@/config/app";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";

interface PostData {
  id: string;
  title: string;
  date: string;
  author: string;
  cover: string; // Add the cover field
  excerpt: string; // Add the excerpt field
}

interface Props {
  allPostsData: PostData[];
}

const BLUR_FADE_DURATION = 0.4;
const BLUR_FADE_DELAY = 0.5;

export default function News({ allPostsData }: Props) {
  return (
    <div className="max-w-7xl mx-auto py-12 sm:py-24 px-6">
      
      <Link href="/" passHref>
        <Button variant="outline" className="group">
          <ChevronLeft size={18} className="mr-1 transition-transform duration-300 group-hover:translate-x-[-0.2rem]" />
          Back
        </Button>
      </Link>
      <div className="py-8">
        <h1 className="text-4xl tracking-tight font-bold">QuakeHub News</h1>
        <p className="mt-4">
          Read all the news about QuakeHub changes, updates, announcements, and more.
        </p>
      </div>
      <div className="flex gap-6">
        {allPostsData.map(({ id, title, date, author, cover, excerpt }) => {
          const authorImg =
            config.news.authors[author] || "/path-to-default-author-image.jpg";

          return (
            <BlurFade key={id} duration={BLUR_FADE_DURATION} delay={BLUR_FADE_DELAY} inView>
            <NewsCard
              key={id}
              title={title}
              description={excerpt} // Use the excerpt as description
              date={date}
              imgSrc={cover} // Use the cover image from the markdown
              imgAlt={title}
              href={`/news/${id}`}
              badgeText="Update" // Change based on post type if needed
              authorImg={authorImg}
            />
            </BlurFade>
          );
        })}
      </div>
    </div>
    
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};
