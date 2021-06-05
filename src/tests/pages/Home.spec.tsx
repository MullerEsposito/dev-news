import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import Home, { getStaticProps } from '../../pages';
import { stripe } from '../../services/stripe';

jest.mock('next/router');
jest.mock('next-auth/client', () => ({
  useSession: () => [null, false],
}));
jest.mock('../../services/stripe');

describe(`Home component`, () => {
  it(`should be rendered correctly`, () => {
    render(<Home product={{ id: 'mocked', amount: 'R$ 10,00' }} />)

    expect(screen.getByText(/R\$ 10,00/i)).toBeInTheDocument();
  })

  it(`should load the initial data`, async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);
    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'mocked',
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            id: 'mocked',
            amount: '$10.00',
          },
        },
      }) 
    );

  })
})