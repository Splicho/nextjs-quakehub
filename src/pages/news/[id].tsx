import { GetStaticPaths, GetStaticProps } from 'next';
import { getSortedPostsData, getPostData, PostContent } from '../../lib/posts'; // Import types
import { ParsedUrlQuery } from 'querystring';

interface PostProps {
  postData: PostContent;
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export default function Post({ postData }: PostProps) {
  return (
    <div>
      <h1>{postData.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getSortedPostsData();
  const paths = posts.map(post => ({
    params: { id: post.id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostProps, Params> = async ({ params }) => {
  if (!params || typeof params.id !== 'string') {
    return { notFound: true };
  }

  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
};
