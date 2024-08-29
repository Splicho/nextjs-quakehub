import Link from "next/link";
import { GetStaticProps } from "next";
import { getSortedPostsData } from "../../lib/posts";
import NewsCard from "@/components/NewsCard";
import { config } from "@/config/app";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface PostData {
  id: string;
  title: string;
  date: string;
  author: string;
  cover: string; // Add the cover field
}

interface Props {
  allPostsData: PostData[];
}

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
          Read all the news about QuakeHub changes, updates, announcements, and
          more.
        </p>
      </div>
      <div className="flex gap-6">
        {allPostsData.map(({ id, title, date, author, cover }) => {
          const authorImg =
            config.news.authors[author] || "/path-to-default-author-image.jpg";

          return (
            <NewsCard
              key={id}
              title={title}
              description="Click to read more..."
              date={date}
              imgSrc={cover} // Use the cover image from the markdown
              imgAlt={title}
              href={`/news/${id}`}
              badgeText="Update" // Change based on post type if needed
              authorImg={authorImg}
            />
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
