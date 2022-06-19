import { GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns'

import { FiCalendar, FiUser } from 'react-icons/fi'

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import ptBR from 'date-fns/locale/pt-BR';

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

export default function Home(props: PostPagination) {
  return (
    <>
      <Head>
        <title>Home | Spacetraveling</title>
      </Head>
      <main className={styles.container}>
        <ul className={styles.postList}>
          {props.results.map(post => (
            <li className={styles.postContent} key={post.uid}>
              <h2>{post.data.title}</h2>
              <p>{post.data.subtitle}</p>
              <div>
              <span>
                <FiCalendar />
                {format(
                  new Date(post.first_publication_date),
                  'dd MMM uuuu',
                  {
                    locale: ptBR
                  }
                )}
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
    pageSize: 100
  });

  const results = allPosts.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: RichText.asText(post.data.title),
        subtitle: RichText.asText(post.data.subtitle),
        author: RichText.asText(post.data.author),
      }
    }
  })

  return {
    props: {
      results
    }
  }
};