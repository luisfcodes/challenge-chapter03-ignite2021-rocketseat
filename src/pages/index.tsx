import { GetStaticProps } from 'next';
import Head from 'next/head';

import { FiCalendar, FiUser } from 'react-icons/fi'

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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

export default function Home(props: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | Spacetraveling</title>
      </Head>
      <main className={styles.container}>
        <ul className={styles.postList}>
          <li className={styles.postContent}>
            <h2>Como utilizar Hooks</h2>
            <p>Pensando em sincronização em vez de ciclos de vida.</p>
            <div>
              <span>
                <FiCalendar />
                19 Abr 2021
              </span>
              <span>
                <FiUser />
                Joseph Oliveira
              </span>
            </div>
          </li>
          <li className={styles.postContent}>
            <h2>Criando um app CRA do zero</h2>
            <p>Tudo sobre como criar a sua primeira aplicação utilizando Create React App.</p>
            <div>
              <span>
                <FiCalendar />
                19 Abr 2021
              </span>
              <span>
                <FiUser />
                Danilo Vieira
              </span>
            </div>
          </li>
        </ul>
      </main>
    </>
  )

}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getAllByType('post', {
    pageSize: 100
  });

  return {
    props: {
      postsResponse
    }
  }
};