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
  excerpt: string; // Add the excerpt field
}

export interface PostContent extends PostData {
  contentHtml: string;
}

// Define the path to your posts directory
const postsDirectory = path.join(process.cwd(), 'src/content/news');

// Function to generate an excerpt
const generateExcerpt = (content: string): string => {
  const MAX_LENGTH = 50; // Maximum length for excerpt
  return content.length > MAX_LENGTH
    ? content.substring(0, MAX_LENGTH) + '...'
    : content;
};

// Update the getSortedPostsData function
export async function getSortedPostsData(): Promise<PostData[]> {
  try {
    const fileNames = fs.readdirSync(postsDirectory);

    const allPostsData = await Promise.all(fileNames.map(async (fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      // Get the content for excerpt generation
      const { content } = matterResult;

      // Destructure title, date, author, and cover from the front matter
      const { title, date, author, cover } = matterResult.data as {
        title: string;
        date: string;
        author?: string; // Author is optional
        cover?: string;  // Cover is optional
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
        excerpt: generateExcerpt(content), // Generate excerpt from content
      };
    }));

    // Sort posts by date, with the most recent first
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error reading posts directory:', error);
    throw error;
  }
}

// Function to get a single post's data including HTML content
export async function getPostData(id: string): Promise<PostContent> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  // Process the content to HTML
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Destructure title, date, author, and cover from the front matter
  const { title, date, author, cover } = matterResult.data as {
    title: string;
    date: string;
    author?: string; // Author is optional
    cover?: string;  // Cover is optional
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
    excerpt: generateExcerpt(matterResult.content), // Add the excerpt
  };
}

// Add a new function to get all post ids
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map(fileName => ({
    params: {
      id: fileName.replace(/\.md$/, '')
    }
  }));
}
