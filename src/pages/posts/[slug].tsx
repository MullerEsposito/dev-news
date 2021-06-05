import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";
import { RichText } from "prismic-dom";

import { getPrismicClient } from "../../services/prismic";
import { Post } from "../../types";
import { formatDate } from "../../utils/formatDate";

import styles from './post.module.scss';

interface PostProps {
  post: Post;  
}

export default function PostDetails({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{ post?.title } | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{ post?.title }</h1>
          <time>{ post?.updatedAt }</time>
          <div 
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post?.content }}
          ></div>
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });
  const { slug } = params;
  const prismic = getPrismicClient(req);

  if (!session?.activeSubscription) {
    return ({
      redirect: {
        destination: '/',
        permanent: false,
      }
    })
  }

  const response = await prismic.getByUID('post', String(slug), {});
  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: formatDate(new Date(response.last_publication_date)),
  }
  
  return ({
    props: { post }
  });
}