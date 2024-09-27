import { getAllPostIds, getPostData, PostContent } from '@/lib/posts';
import { notFound } from 'next/navigation';

interface PostProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const paths = getAllPostIds();
  return paths.map((path) => ({
    id: path.params.id,
  }));
}

export default async function Post({ params }: PostProps) {
  if (!params || typeof params.id !== 'string') {
    notFound();
  }

  try {
    const postData = await getPostData(params.id);
    
    return (
      <div className='max-w-7xl mx-auto py-12 sm:py-24 px-6'>
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
