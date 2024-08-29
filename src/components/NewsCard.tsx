import Image from 'next/image';
import Link from 'next/link';

interface NewsCardProps {
    title: string;
    description: string;
    date: string;
    imgSrc: string;
    imgAlt: string;
    href: string;
    badgeText: string;
    authorImg: string; // Accept author image as a prop
  }
  
  const NewsCard = ({
    title,
    description,
    date,
    imgSrc,
    imgAlt,
    href,
    badgeText,
    authorImg, // Use author image prop
  }: NewsCardProps) => {
    return (
        <div className="rounded-xl ring-1 ring-gray-200 dark:ring-zinc-900 shadow bg-white dark:bg-newscardbg relative group flex flex-col overflow-hidden hover:ring-2 hover:ring-yellow-300 dark:hover:ring-yellow-300 hover:bg-gray-100/50 dark:hover:bg-newscardbg/50">
        <div className="aspect-w-4 aspect-h-2">
          <img
            width="384"
            height="192"
            alt={imgAlt}
            loading="eager"
            src={imgSrc}
            className="object-cover object-top w-full h-full"
          />
        </div>
        <div className="flex-1 px-4 py-5 sm:p-6">
          <Link href={href} passHref>
            <span className="absolute inset-0" aria-hidden="true"></span>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </Link>
          <div className="mt-6 flex items-center justify-between">
            <time className="text-gray-500 dark:text-gray-400">{date}</time>
            <div className="inline-flex items-center">
              <img
                className="rounded-full h-6 w-6 text-xs ring-2 ring-white dark:ring-gray-900"
                alt="Author"
                src={authorImg}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default NewsCard;
  
