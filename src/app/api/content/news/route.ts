import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/news');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    return getSinglePost(id);
  } else {
    return getAllPosts();
  }
}

function getSinglePost(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const post = {
    id,
    content: matterResult.content,
    ...(matterResult.data as object),
  };

  return NextResponse.json(post);
}

function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as object),
      excerpt: matterResult.content.slice(0, 200) + '...' // Simple excerpt
    };
  });

  return NextResponse.json(allPostsData);
}