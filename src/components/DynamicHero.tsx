"use client";

import { useEffect, useState } from 'react';
import AnimatedShinyText from "@/components/magicui/animated-shiny-text"; 
import BlurFade from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";
import { PostData } from '@/lib/posts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export default function DynamicHero() {
  const [latestPostTitle, setLatestPostTitle] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLatestPostTitle() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/content/news`);
        if (!res.ok) throw new Error('Failed to fetch posts');
        const posts: PostData[] = await res.json();
        if (posts.length > 0) {
          setLatestPostTitle(posts[0].title);
        }
      } catch (error) {
        console.error('Error fetching latest post:', error);
      }
    }

    fetchLatestPostTitle();
  }, []);

  return (
    <section className="relative flex justify-center text-center p-48">
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover opacity-35"
          autoPlay
          muted
          loop
        >
          <source src="/video/hero-intro.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="z-10 flex items-center justify-center">
          <BlurFade delay={0.25} inView>
            <div
              className={cn(
                "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              )}
            >
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                {latestPostTitle ? (
                  <span>Latest: {latestPostTitle}</span>
                ) : (
                  <span>QuakeHub v1 is live!</span>
                )}
              </AnimatedShinyText>
            </div>
          </BlurFade>
        </div>
        <BlurFade delay={0.25 * 2} inView>
          <h1 className="text-5xl font-bold tracking-tighter text-white">
            Real-Time{" "}
            <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
              Quake Live
            </span>{" "}
            Server Tracking
          </h1>
        </BlurFade>
        <BlurFade delay={0.25 * 3} inView>
          <p className="text-zinc-500">
            Track, monitor, and join QuakeLive servers with live data from Steam.
          </p>
        </BlurFade>
      </div>
    </section>
  );
}