import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { config } from '@/config/app';
import html from 'remark-html';
import { remark } from 'remark';

// Define and export the types
export interface PostData {
  id: string;
  title: string;
  date: string;
  author: string;
  cover: string;
}

export interface PostContent extends PostData {
  contentHtml: string;
}

const postsDirectory = path.join(process.cwd(), 'src/content/news');

export function getSortedPostsData(): PostData[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory);

    // Ensure that fileNames is an array of file names in the directory
    const allPostsData: PostData[] = fileNames.map(fileName => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      const { title, date, author, cover } = matterResult.data as {
        title: string;
        date: string;
        author?: string; // Author is optional here
        cover?: string;  // Cover is optional here
      };

      // Validate author and use default if necessary
      const validatedAuthor = author && config.news.authors[author]
        ? author
        : 'default-author'; // Ensure 'default-author' exists in your config

      return {
        id,
        title,
        date,
        author: validatedAuthor,
        cover: cover || "/path-to-default-cover-image.jpg", // Default cover image if not provided
      };
    });

    // Sort posts by date, with the most recent first
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    throw error;
  }
}

export async function getPostData(id: string): Promise<PostContent> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const { title, date, author, cover } = matterResult.data as {
    title: string;
    date: string;
    author: string;
    cover: string;
  };

  // Validate author and use default if necessary
  const validatedAuthor = author && config.news.authors[author]
    ? author
    : 'default-author'; // Ensure 'default-author' exists in your config

  return {
    id,
    title,
    date,
    author: validatedAuthor,
    cover: cover || "/path-to-default-cover-image.jpg",
    contentHtml, // Add the converted HTML content
  };
}
