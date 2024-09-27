import { remark } from 'remark';
import html from 'remark-html';

// Define and export the types
export interface PostData {
  id: string;
  title: string;
  date: string;
  author: string;
  cover: string;
  excerpt: string;
}

export interface PostContent extends PostData {
  contentHtml: string;
}

// Function to generate an excerpt
const generateExcerpt = (content: string): string => {
  const MAX_LENGTH = 50;
  return content.length > MAX_LENGTH
    ? content.substring(0, MAX_LENGTH) + '...'
    : content;
};

// Update the getSortedPostsData function
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export async function getSortedPostsData(): Promise<PostData[]> {
  const res = await fetch(`${API_BASE_URL}/api/content/news?t=${Date.now()}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  const posts = await res.json();
  return posts.sort((a: PostData, b: PostData) => (a.date < b.date ? 1 : -1));
}

// Function to get a single post's data including HTML content
export async function getPostData(id: string): Promise<PostContent> {
  const res = await fetch(`${API_BASE_URL}/api/content/news?id=${id}`);
  if (!res.ok) throw new Error('Failed to fetch post');
  const post = await res.json();

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(post.content);
  const contentHtml = processedContent.toString();

  return {
    ...post,
    contentHtml,
  };
}

// Add a new function to get all post ids
export async function getAllPostIds() {
  const posts = await getSortedPostsData();
  return posts.map(post => ({
    params: { id: post.id }
  }));
}

// Make sure this function is exported
export async function getLatestPost(): Promise<PostData | null> {
  const allPosts = await getSortedPostsData();
  return allPosts.length > 0 ? allPosts[0] : null;
}

// If you have default exports, keep them
export default { getLatestPost };
