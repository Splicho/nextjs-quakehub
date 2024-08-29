import Link from 'next/link';
import { GetStaticProps } from 'next';
import { getSortedPostsData } from '../../lib/posts';

interface PostData {
  id: string;
  title: string;
  date: string;
}

interface Props {
  allPostsData: PostData[];
}

export default function News({ allPostsData }: Props) {
  return (
    <>
      <h1>News</h1>
      <ul>
        {allPostsData.map(({ id, title, date }) => (
          <li key={id}>
            <Link href={`/news/${id}`} passHref>
              {title} {/* Updated usage */}
            </Link>
            <br />
            <small>{date}</small>
          </li>
        ))}
      </ul>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
};
