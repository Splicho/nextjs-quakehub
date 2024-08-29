import Image from "next/image";
import Link from "next/link";

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
          <div className="mb-6 flex">
            <span className="inline-flex items-center font-medium rounded-md text-xs px-2 py-1 bg-yellow-300 dark:bg-primary-400 dark:bg-opacity-20 text-[#ffd600] dark:text-primary-400 ring-1 ring-inset ring-yellow-500 dark:ring-primary-400 ring-opacity-25 dark:ring-opacity-25">
              Release
            </span>
          </div>
          <h3 className="text-gray-900 dark:text-white font-semibold truncate flex items-center gap-1.5 text-lg">
            {title}
          </h3>
          <p className="text-[15px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 truncat">
            {description}
          </p>
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
