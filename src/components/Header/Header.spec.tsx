
import { render } from '@testing-library/react';
import { Header } from '.';

jest.mock('next/router', () => ({
  useRouter: () => {
    return { asPath: '/' }
  }
}));

jest.mock('next-auth/client', () => ({
  useSession: () => {
    return [null, false];
  }
}))

describe('Test Header component', () => {
  it('should be rendered correctly', () => {
    const { getByText } = render(
      <Header />
    );

    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('Posts')).toBeInTheDocument();
  })
})