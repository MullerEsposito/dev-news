import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic';

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../services/prismic');

const post = { 
  slug: 'Mocked Slug', 
  title: 'Mocked Title', 
  resume: 'Mocked Resume', 
  content: '<p>Mocked Content<p>',
  updatedAt: 'Mocked Data',
};

describe(`PostPreview page`, () => {
  it(`should be rendered correctly`, () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<PostPreview post={post} />);

    expect(screen.getByText('Mocked Title')).toBeInTheDocument();
    expect(screen.getByText('Mocked Data')).toBeInTheDocument();
    expect(screen.getByText(/Wanna continue reading?/i)).toBeInTheDocument();
  });

  it(`should be redirect to the post page case has an active subscription`, () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([{ activeSubscription: true }, false]);

    const pushMocked = jest.fn();

    const useRouterMocked = mocked(useRouter);
    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    } as any);

    render(<PostPreview post={post} />);

    expect(pushMocked).toBeCalledWith(`/posts/${post.slug}`);
  });

  it(`should be load the initial data`, async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ 
            type: 'heading', 
            text: 'Test title' 
          }],
          content: [{ 
            type: 'paragraph', 
            text: 'Test text paragraph' 
          }],
        },
        last_publication_date: '06-04-2021',
      })
    } as any);

    const response = await getStaticProps({ params: { slug: post.slug } } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: post.slug,
            title: 'Test title',
            content: '<p>Test text paragraph</p>',
            updatedAt: '04 de junho de 2021',
          },
        },
      })
    );
  })
})