import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { INavigationScreenLifecycle } from '../../service/navigation/components/navigation-screen.container';
import { Home, IHomeVM } from './home.component';
import { IHomeAPI, IHomeOptions } from './home.vm';
import { HomeVM } from './home.vm';

describe('Home', () => {

  let vm: IHomeVM;
  let deps: IHomeOptions;

  const lifecycle: INavigationScreenLifecycle = {
    subscribe: jest.fn(listener => listener.onMount?.()),
  };

  const dataProvider: IHomeAPI = {
    getPosts: jest.fn(() => Promise.resolve([])),
  };

  beforeEach(() => {
    deps = {
      session: jest.requireMock('../../service/session/session.service').SessionService(),
      navigation: jest.requireMock('../../service/navigation/navigation.service').NavigationService(),
      user: jest.requireMock('../../service/user/user.service').UserService(),
      api: dataProvider,
      logger: jest.requireMock('../../service/log/log.service').LogService(),
    };
    vm = new HomeVM(lifecycle, deps);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with user name in title', () => {
    deps.user.getUser = jest.fn(() => ({ id: '1', name: 'Test User' }));

    const api = render(<Home vm={vm} />);
    expect(api.findByText(/Test User/)).toBeTruthy();
  });

  it('should replace with welcome screen when logged out', async () => {
    const api = render(<Home vm={vm} />);
    fireEvent.press(api.getByTestId('logout-button'));

    await waitFor(() => {
      expect(deps.navigation.replace).toHaveBeenCalledWith('/welcome');
    });
  });

  it('should not navigate if logout is unsuccessful', async () => {
    deps.session.logout = jest.fn(() => Promise.reject());

    const api = render(<Home vm={vm} />);
    fireEvent.press(api.getByTestId('logout-button'));

    await waitFor(() => {
      expect(deps.navigation.replace).not.toHaveBeenCalled();
    });
  });
});
