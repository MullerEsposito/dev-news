import { GetStaticProps } from "next";
import Head from "next/head";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

import { getPrismicClient } from "../../services/prismic";
import { Post } from "../../types";

import styles from './styles.module.scss';
import { formatDate } from "../../utils/formatDate";
import Link from "next/link";



interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {
            posts.map(post => (
              <Link key={post.slug} href={`/posts/${post.slug}`}>
                <a>
                  <time>{post.updatedAt}</time>
                  <strong>{post.title}</strong>
                  <p>{post.resume}</p>
                </a>
              </Link>
            ))
          }
        </div>
      </main>

    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'post')
  ], {
    fetch: ['post.title', 'post.content'],
    pageSize: 100,
  });

  const posts = response.results.map(post => ({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    resume: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
    updatedAt: formatDate(new Date(post.last_publication_date)),
  }))

  return {
    props: { posts }
  }
}