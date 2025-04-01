import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

import { INavigationScreenLifecycle } from '../../service/navigation/components/navigation-screen.container';
import { ISplashVM, Splash } from './splash.component';
import { ISplashOptions, SplashVM } from './splash.vm';

describe('Splash', () => {

  let vm: ISplashVM;
  let deps: ISplashOptions;

  const lifecycle: INavigationScreenLifecycle = {
    subscribe: jest.fn(listener => listener.onMount?.()),
  };

  beforeEach(() => {
    deps = {
      navigation: jest.requireMock('../../service/navigation/navigation.service').NavigationService(),
      session: jest.requireMock('../../service/session/session.service').SessionService(),
    };
    vm = new SplashVM(lifecycle, deps);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should navigate to home screen if session is restored', async () => {
    render(<Splash vm={vm} />);

    await waitFor(() => {
      return expect(deps.navigation.replace).toHaveBeenCalledWith('/home');
    });
  });

  it('should navigate to welcome screen if session is not restored', async () => {
    deps.session.restore = jest.fn(() => Promise.reject());
    vm = new SplashVM(lifecycle, deps);

    render(<Splash vm={vm} />);

    await waitFor(() => {
      return expect(deps.navigation.replace).toHaveBeenCalledWith('/welcome');
    });
  });
});
