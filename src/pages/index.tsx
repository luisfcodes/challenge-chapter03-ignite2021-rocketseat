import { GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns'

import { FiCalendar, FiUser } from 'react-icons/fi'

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(props:HomeProps) {
  return (
    <>
      <Head>
        <title>Home | Spacetraveling</title>
      </Head>
      <main className={styles.container}>
        <ul>
          {props.postsPagination.results.map(post => (
            <li className={styles.postContent} key={post.uid}>
              <Link href={`/post/${post.uid}`}>
                <h2>{post.data.title}</h2>
              </Link>
              <p>{post.data.subtitle}</p>
              <div>
              <span>
                <FiCalendar />
                {post.first_publication_date}
              </span>
              <span>
                <FiUser />
                {post.data.author}
              </span>
            </div>
            </li>
          ))}
        </ul>
      </main>
    </>
  )

}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const allPosts = await prismic.getAllByType('post', {
    pageSize: 10
  });

  const results = allPosts.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM uuuu',
        {
          locale: ptBR
        }
      ),
      data: {
        title: RichText.asText(post.data.title),
        subtitle: RichText.asText(post.data.subtitle),
        author: RichText.asText(post.data.author),
      }
    }
  })

  return {
    props: {
      postsPagination: {
        results,
        next_page: ''
      }
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
};