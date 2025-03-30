import { ISessionService } from "./model";

jest.mock('./session.service', () => {
  const sessionService: ISessionService = {
    login: jest.fn(() => Promise.resolve()),
    register: jest.fn(() => Promise.resolve()),
    refresh: jest.fn(() => Promise.resolve()),
    restore: jest.fn(() => Promise.resolve()),
    logout: jest.fn(() => Promise.resolve()),
  };

  return {
    SessionService: jest.fn().mockImplementation(() => sessionService),
  };
});

