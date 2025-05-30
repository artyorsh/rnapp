import React from 'react';
import { View } from 'react-native';
import { ReactNavigationRouter } from './react-navigation-router';
import { render, waitFor } from '@testing-library/react-native';

import { ILogService } from '@/log';

import { IRouter } from '..';
import { StackRouteFactory } from './stack-route-factory';

jest.unmock('./react-navigation-router');

const NAVIGATION_EVENT_DEBOUNCE_MS = 10;

describe('ReactNavigationRouter', () => {

  let logService: ILogService;
  let router: IRouter;

  beforeEach(() => {
    logService = jest.requireMock('@/log/log.service').LogService();
    router = new ReactNavigationRouter(logService, StackRouteFactory({
      '/': () => React.createElement(View, { testID: 'screen-root' }),
      '/home': () => React.createElement(View, { testID: 'screen-home' }),
      '/welcome': () => React.createElement(View, { testID: 'screen-welcome' }),
      '/login': () => React.createElement(View, { testID: 'screen-login' }),
      '/register': () => React.createElement(View, { testID: 'screen-register' }),
    }));
  });

  it('should mount only root screen', () => {
    const api = render(router.getWindow());

    expect(api.getByTestId('screen-root')).toBeTruthy();
    expect(api.queryByTestId('screen-home')).toBeFalsy();
  });

  it('should mount target screen on navigate', async () => {
    const api = render(router.getWindow());

    router.navigate('/home');

    await waitFor(() => {
      expect(api.getByTestId('screen-home')).toBeTruthy();
    });
  });

  it('should unmount target screen, mount root screen on goBack', async () => {
    const api = render(router.getWindow());

    router.navigate('/home');

    await new Promise((resolve) => setTimeout(resolve, NAVIGATION_EVENT_DEBOUNCE_MS));
    router.goBack();

    await waitFor(() => {
      expect(api.queryByTestId('screen-home')).toBeFalsy();
      expect(api.getByTestId('screen-root')).toBeTruthy();
    });
  });

  it('should notify root screen on focus', async () => {
    const onFocusListener = jest.fn();
    router.subscribe('/', { onFocus: onFocusListener });

    render(router.getWindow());

    await waitFor(() => {
      expect(onFocusListener).toHaveBeenCalledTimes(1);
    });
  });

  it('should notify target screen on focus, parent screen on blur', async () => {
    const onFocusListener = jest.fn();
    router.subscribe('/home', { onFocus: onFocusListener });

    const onBlurListener = jest.fn();
    router.subscribe('/', { onBlur: onBlurListener });

    render(router.getWindow());
    router.navigate('/home');

    await waitFor(() => {
      expect(onFocusListener).toHaveBeenCalledTimes(1);
      expect(onBlurListener).toHaveBeenCalledTimes(1);
    });
  });

  it('should notify target screen on blur, parent screen on focus', async () => {
    const onBlurListener = jest.fn();
    router.subscribe('/home', { onBlur: onBlurListener });

    const onFocusListener = jest.fn();
    router.subscribe('/', { onFocus: onFocusListener });

    render(router.getWindow());
    router.navigate('/home');

    await new Promise((resolve) => setTimeout(resolve, NAVIGATION_EVENT_DEBOUNCE_MS));
    router.goBack();

    await waitFor(() => {
      expect(onBlurListener).toHaveBeenCalledTimes(1);
      expect(onFocusListener).toHaveBeenCalledTimes(2);
    });
  });

});
