import { INavigationService } from './model';

jest.mock('./navigation.service', () => {
  const navigationService: INavigationService = {
    navigator: jest.fn(),
    goTo: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
  };

  return {
    NavigationService: jest.fn().mockImplementation(() => navigationService),
  };
});
