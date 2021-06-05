import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { mocked } from 'ts-jest/utils';

import { SignInButton } from '.';

jest.mock('next-auth/client');

describe('SignInButton component', () => {
  it(`should be rendered correctly when user isn't authenticated`, () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);
    
    render(<SignInButton />);
    expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
  })

  it(`should be rendered correctly when user is authenticated`, () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([{
      user: {
        name: 'Jhon Doe',
        email: 'jhondoe@hotmail.com',
        image: 'imageJhonDoe',
      },
      expires: 'mocked',
    }, false]);

    render(<SignInButton />);
    expect(screen.getByText('Jhon Doe')).toBeInTheDocument();
  })
})