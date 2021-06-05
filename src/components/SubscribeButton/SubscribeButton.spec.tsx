import { fireEvent, render, screen } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from "ts-jest/utils";

import { SubscribeButton } from '.';

jest.mock('next-auth/client');

jest.mock('next/router');

const session = {
  isAuthenticated() {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([{
      user: {
        name: 'Jhon Doe',
        email: 'jhondoe@hotmail.com',
        image: 'imageJhonDoe',
      },
      activeSubscription: 'mocked',
      expires: 'mocked',
    } , false]);
  },
  isNotAuthenticated() {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);
  },
}

describe(`SubscribeButton component`, () => {
  it(`should be rendered correctly`, () => {
    session.isNotAuthenticated();

    render(<SubscribeButton />);

    expect(screen.getByText('Subscribe now')).toBeInTheDocument();
  })

  it(`should be redirect to signIn when user isn't authenticated`, () => {
    const signInMocked = mocked(signIn);
    session.isNotAuthenticated();

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  })  

  it(`should be redirect to posts when user already has a subscription`, () => {
    const useRouterMocked = mocked(useRouter);
    const pushMocked = jest.fn();

    session.isAuthenticated();
    
    useRouterMocked.mockReturnValueOnce({ push: pushMocked } as any);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');
    fireEvent.click(subscribeButton);

    expect(pushMocked).toHaveBeenCalledWith('/posts');
  })
})