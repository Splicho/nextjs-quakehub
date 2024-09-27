import { getAllPostIds, getPostData } from '@/lib/posts';
import { notFound } from 'next/navigation';

interface PostProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const paths = await getAllPostIds();
  return paths.map((path: { params: { id: string } }) => ({
    id: path.params.id,
  }));
}

export default async function Post({ params }: PostProps) {
  console.log('Attempting to fetch post with id:', params.id);

  if (!params || typeof params.id !== 'string') {
    notFound();
  }

  try {
    const postData = await getPostData(params.id);
    console.log('Post data fetched:', postData);
    
    return (
      <div className='max-w-[1440px] mx-auto py-12 sm:py-24 px-6'>
        <h1 className='text-4xl tracking-tight font-bold'>{postData.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }
}

// Optionally, you can add this to enable ISR (Incremental Static Regeneration)
export const revalidate = 10;
