import { ILogService } from "../log/model";
import { ISessionService } from "../session/model";
import { IUserService } from "./model";
import { UserService } from "./user.service";

jest.unmock('./user.service');

describe('UserService', () => {

  let userService: IUserService;
  let sessionService: ISessionService;
  let logService: ILogService;

  beforeEach(() => {
    sessionService = jest.requireMock('../session/session.service').SessionService();
    logService = jest.requireMock('../log/log.service').LogService();

    userService = new UserService({
      sessionService,
      userRepository: {
        getUser: jest.fn(() => Promise.resolve({ id: '1', name: 'John Doe' })),
      },
      logger: logService,
    });
  });

  it('should throw when session is not initialized', () => {
    expect(() => userService.getUser())
      .toThrow(/User not found/);
  });

  it('should get user when initialized', async () => {
    let initializationPromise;

    sessionService.addModule = jest.fn(module => {
      initializationPromise = module.initialize({ userId: '1', secret: '123' });
      return initializationPromise;
    });

    userService = new UserService({
      sessionService,
      userRepository: {
        getUser: jest.fn(() => Promise.resolve({ id: '1', name: 'John Doe' })),
      },
      logger: jest.requireMock('../log/log.service').LogService(),
    });

    await initializationPromise;

    expect(userService.getUser())
      .toEqual({ id: '1', name: 'John Doe' });
  });

  it('should add user id to log labels when initialized', async () => {
    let initializationPromise;

    sessionService.addModule = jest.fn(module => {
      initializationPromise = module.initialize({ userId: '1', secret: '123' });
      return initializationPromise;
    });

    await initializationPromise;

    expect(logService.addLabel).toHaveBeenCalledWith('user_id', '1');
  });
});
