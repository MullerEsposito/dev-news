import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';
import Posts, { getStaticProps } from '../../pages/posts';
import PostDetails, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic';

const post = { 
  slug: 'Mocked Slug', 
  title: 'Mocked Title', 
  resume: 'Mocked Resume', 
  content: '<p>Mocked Content<p>',
  updatedAt: 'Mocked Data',
};

jest.mock('../../services/prismic');
jest.mock('next-auth/client');

describe(`Post page`, () => {
  it(`should be rendered correctly`, () => {

    render(<PostDetails post={post} />);

    expect(screen.getByText('Mocked Title')).toBeInTheDocument();
    expect(screen.getByText('Mocked Content')).toBeInTheDocument();
    expect(screen.getByText('Mocked Data')).toBeInTheDocument();
  })

  it(`should be redirect to home if subscription isn't found`, async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce(null);

    
    const response = await getServerSideProps({ params: { slug: post.slug } } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
          permanent: false,
        }),
      }),
    );

  });

  it(`should be rendered the initial data`, async () => {
    const getSessionMocked = mocked(getSession);
    getSessionMocked.mockResolvedValueOnce({ activeSubscription: true});

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

    const response = await getServerSideProps({ params: { slug: post.slug } } as any);

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