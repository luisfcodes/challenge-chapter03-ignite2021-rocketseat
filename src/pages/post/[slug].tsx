import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import { FiCalendar, FiUser, FiClock } from "react-icons/fi";
import styles from './post.module.scss';
import { RichText } from 'prismic-dom';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({post}: PostProps) {
  //console.log(post)
  return (
    <>
      <Head>
        <title>{post.data.title}</title>
      </Head>

      <main className={styles.postContainer}>
        <img src={post.data.banner.url} alt="banner post" />

        <section>
          <header>
            <h1>{post.data.title}</h1>
            <div className={styles.postInfo}>
              <span>
                <FiCalendar />
                {post.first_publication_date}
              </span>
              <span>
                <FiUser />
                {post.data.author}
              </span>
              <span>
                <FiClock />
                4 min
              </span>
            </div>
          </header>

          <div className={styles.postContent}>

            {post.data.content.map(content => (
              <div key={content.heading}>
                <h2>{content.heading}</h2>
                <div className={styles.postContentParagraphs}>
                  <div dangerouslySetInnerHTML={{__html: String(content.body)}}   />
              </div>
              </div>
            ))}

          </div>
        </section>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  //const posts = await prismic.getByType(TODO);

  return {
    paths: [],
    fallback: 'blocking'
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('post', String(params.slug))

  const post = {
    first_publication_date: format(
      new Date(response.first_publication_date),
      'dd MMM uuuu',
      {
        locale: ptBR
      }
    ),
    data: {
      title: RichText.asText(response.data.title),
      banner: {
        url: response.data.banner.url,
      },
      author: RichText.asText(response.data.author),
      content: response.data.content.map(teste => {
        return {
          heading: RichText.asText(teste.heading),
          body: RichText.asHtml(teste.body)
        }
      })
    },
  }

  return {
    props: {
      post
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
};
