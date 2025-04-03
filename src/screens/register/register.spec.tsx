import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { INavigationScreenLifecycle } from '@service/navigation/components/navigation-screen.container';

import { IRegisterVM, Register } from './register.component';
import { IRegisterOptions, RegisterVM } from './register.vm';

describe('Register Component', () => {

  let vm: IRegisterVM;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    vm = {
      title: 'Register Title',
      submit: jest.fn(),
      goBack: jest.fn(),
    };
  });

  it('should render without initial values', () => {
    const api = render(<Register vm={vm} />);

    expect(api.getByTestId('email-input').props.value).toBe('');
    expect(api.getByTestId('password-input').props.value).toBe('');
  });

  it('should call submit with correct values', () => {
    const api = render(<Register vm={vm} />);

    fireEvent.changeText(api.getByTestId('email-input'), 'test2@test.com');
    fireEvent.changeText(api.getByTestId('password-input'), 'password2');

    fireEvent.press(api.getByTestId('submit-button'));

    expect(vm.submit).toHaveBeenCalledWith({ email: 'test2@test.com', password: 'password2' });
  });
});

describe('Register VM', () => {
  let vm: IRegisterVM;

  const lifecycle: INavigationScreenLifecycle = {
    subscribe: jest.fn(listener => listener.onMount?.()),
  };

  const deps: IRegisterOptions = {
    session: jest.requireMock('@service/session/session.service').SessionService(),
    navigation: jest.requireMock('@service/navigation/navigation.service').NavigationService(),
  };

  beforeEach(() => {
    vm = new RegisterVM(lifecycle, deps);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should navigate to home screen if registration is successful', async () => {
    vm.submit({ email: 'test@test.com', password: 'password' });

    await waitFor(() => {
      expect(deps.navigation.replace).toHaveBeenCalledWith('/home');
    });
  });

  it('should not navigate if registration is unsuccessful', async () => {
    deps.session.register = jest.fn(() => Promise.reject());
    vm = new RegisterVM(lifecycle, deps);

    vm.submit({ email: 'test@test.com', password: 'password' });

    await waitFor(() => {
      expect(deps.navigation.replace).not.toHaveBeenCalled();
    });
  });
});
