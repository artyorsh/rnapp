import { IUserService } from './model';

jest.mock('./user.service', () => {
  const userService: IUserService = {
    getUser: jest.fn(() => ({ id: '1', name: 'John Doe' })),
  };

  return {
    UserService: jest.fn().mockImplementation(() => userService),
  };
});

