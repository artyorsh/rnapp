import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

import { INavigationScreenLifecycle } from '../../service/navigation/components/navigation-screen.container';
import { ISplashVM, Splash } from './splash.component';
import { ISplashOptions, SplashVM } from './splash.vm';

describe('Splash Component', () => {

  let vm: ISplashVM;

  beforeEach(() => {
    vm = {
      title: 'Splash Title',
    };
  });

  it('should render with correct title', () => {
    const api = render(<Splash vm={vm} />);
    expect(api.getByText('Splash Title')).toBeTruthy();
  });
});

describe('Splash VM', () => {
  const lifecycle: INavigationScreenLifecycle = {
    subscribe: jest.fn(listener => listener.onMount?.()),
  };

  const deps: ISplashOptions = {
    navigation: jest.requireMock('../../service/navigation/navigation.service').NavigationService(),
    session: jest.requireMock('../../service/session/session.service').SessionService(),
  };

  let vm: ISplashVM;

  beforeEach(() => {
    vm = new SplashVM(lifecycle, deps);
  });

  it('should navigate to home screen if session is restored', async () => {
    await waitFor(() => {
      return expect(deps.navigation.replace).toHaveBeenCalledWith('/home');
    });
  });

  it('should navigate to welcome screen if session is not restored', async () => {
    deps.session.restore = jest.fn(() => Promise.reject());
    vm = new SplashVM(lifecycle, deps);

    await waitFor(() => {
      return expect(deps.navigation.replace).toHaveBeenCalledWith('/welcome');
    });
  });
});
