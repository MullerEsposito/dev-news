import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect } from "react";

import { getPrismicClient } from "../../../services/prismic";
import { Post } from "../../../types";
import { formatDate } from "../../../utils/formatDate";

import styles from '../post.module.scss';

interface PostPreviewProps {
  post: Post;  
}

export default function PostPreview({ post }: PostPreviewProps) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{ post?.title } | DevNews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{ post?.title }</h1>
          <time>{ post?.updatedAt }</time>
          <div 
            className={`${styles.content} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post?.content }}
          ></div>

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>Subscribe now</a>
            </Link>🤗
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
})

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});
  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: formatDate(new Date(response.last_publication_date)),
  }
  
  return ({
    props: { post },
    revalidate: 60 * 30, // 30 minutes
  });
}