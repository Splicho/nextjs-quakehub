import { GetStaticPaths, GetStaticProps } from 'next';
import { getSortedPostsData, getPostData, PostContent } from '../../lib/posts'; // Adjust path if needed
import { ParsedUrlQuery } from 'querystring';

interface PostProps {
  postData: PostContent;
}

interface Params extends ParsedUrlQuery {
  id: string;
}

const Post = ({ postData }: PostProps) => {
  return (
    <div>
      <h1>{postData.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </div>
  );
};

export default Post;

// Define and export `getStaticPaths`
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getSortedPostsData();
  const paths = posts.map(post => ({
    params: { id: post.id },
  }));

  return {
    paths,
    fallback: 'blocking', // Adjust fallback mode as needed
  };
};

// Define and export `getStaticProps`
export const getStaticProps: GetStaticProps<PostProps, Params> = async ({ params }) => {
  if (!params || typeof params.id !== 'string') {
    return { notFound: true };
  }

  try {
    const postData = await getPostData(params.id);
    return {
      props: {
        postData,
      },
      revalidate: 10, // Optional: enables Incremental Static Regeneration
    };
  } catch (error) {
    return { notFound: true };
  }
};
