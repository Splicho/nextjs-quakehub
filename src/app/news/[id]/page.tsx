import { getAllPostIds, getPostData } from '@/lib/posts';
import { notFound } from 'next/navigation';

interface PostProps {
  params: { id: string };
}

export async function generateStaticParams() {
  try {
    const paths = await getAllPostIds();
    return paths.map((path: { params: { id: string } }) => ({
      id: path.params.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function Post({ params }: PostProps) {
  if (!params || typeof params.id !== 'string') {
    return notFound();
  }

  try {
    const postData = await getPostData(params.id);
    
    return (
      <div className='max-w-[1440px] mx-auto py-12 sm:py-24 px-6'>
        <h1 className='text-4xl tracking-tight font-bold'>{postData.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    return notFound();
  }
}

export const revalidate = 10;
