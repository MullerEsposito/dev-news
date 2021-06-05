import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic';

const posts = [
  { 
    slug: 'Mocked Slug', 
    title: 'Mocked Title', 
    resume: 'Mocked Resume', 
    content: 'Mocked Content',
    updatedAt: 'Mocked Data',
  }
]

jest.mock('../../services/prismic');

describe(`Posts page`, () => {
  it(`should be rendered correctly`, () => {

    render(<Posts posts={posts} />);

    expect(screen.getByText('Mocked Title')).toBeInTheDocument();
    expect(screen.getByText('Mocked Resume')).toBeInTheDocument();
    expect(screen.getByText('Mocked Data')).toBeInTheDocument();
  })

  it(`should be render the initial date`, async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);
    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'Id Test',
            data: {
              title: [
                { type: 'heading', text: 'Test title' }
              ],
              content: [
                { type: 'paragraph', text: 'Test text paragraph' }
              ],
            },
            last_publication_date: '06-04-2021',
          }
        ]
      }),
    } as any)

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'Id Test',
              title: 'Test title',
              resume: 'Test text paragraph',
              updatedAt: '04 de junho de 2021'
            }
          ]
        }
      })
    );

  });
  
})