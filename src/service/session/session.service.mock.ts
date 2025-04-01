import { ISessionService } from "./model";

jest.mock('./session.service', () => {
  const sessionService: ISessionService = {
    login: jest.fn(() => Promise.resolve({ userId: '1', secret: '123' })),
    register: jest.fn(() => Promise.resolve({ userId: '1', secret: '123' })),
    refresh: jest.fn(() => Promise.resolve({ userId: '1', secret: '123' })),
    restore: jest.fn(() => Promise.resolve({ userId: '1', secret: '123' })),
    logout: jest.fn(() => Promise.resolve()),
    addModule: jest.fn(),
  };

  return {
    SessionService: jest.fn().mockImplementation(() => sessionService),
  };
});

