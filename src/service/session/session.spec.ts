import { ISessionModule } from "./model";
import { AnyAuthenticationProvider, AnyAuthenticationStorage, SessionService } from "./session.service";

import { AnyAuthenticationToken } from "./session.service";

jest.unmock('./session.service');

describe('SessionService', () => {

  const TWO_MINUTES_MS: number = 2 * 60 * 1000;

  const createToken = (validMs: number): AnyAuthenticationToken => ({
    provider: 'local',
    secret: '123',
    userId: '1',
    expiresAt: Date.now() + validMs,
    payload: {},
  });

  let authenticationProvider: AnyAuthenticationProvider;

  let authenticationStorage: AnyAuthenticationStorage;

  let sessionService: SessionService;

  beforeEach(() => {
    authenticationProvider = {
      login: jest.fn(() => Promise.resolve(createToken(TWO_MINUTES_MS))),
      register: jest.fn(() => Promise.resolve(createToken(TWO_MINUTES_MS))),
      refresh: jest.fn(() => Promise.resolve(createToken(TWO_MINUTES_MS))),
    };

    authenticationStorage = {
      getToken: jest.fn(() => Promise.resolve(null)),
      setToken: jest.fn(() => Promise.resolve()),
      clear: jest.fn(() => Promise.resolve()),
    };

    sessionService = new SessionService({
      authenticationProvider,
      authenticationStorage,
      tokenRefreshThresholdMinutes: 1,
    });
  });

  it('should login', async () => {
    await expect(sessionService.login('test@test.com', 'password'))
      .resolves
      .toEqual({ userId: '1', secret: '123' });
  });

  it('should register', async () => {
    await expect(sessionService.register('test@test.com', 'password'))
      .resolves
      .toEqual({ userId: '1', secret: '123' });
  });

  it('should refresh with stored token', async () => {
    sessionService = new SessionService({
      authenticationProvider,
      authenticationStorage: {
        ...authenticationStorage,
        getToken: () => Promise.resolve(createToken(TWO_MINUTES_MS)),
      },
      tokenRefreshThresholdMinutes: 1,
    });

    await expect(sessionService.refresh())
      .resolves
      .toEqual({ userId: '1', secret: '123' });
  });

  it('should not refresh without stored token', async () => {
    await expect(sessionService.refresh())
      .rejects
      .toThrow();
  });

  it('should restore with refreshing expiring token', async () => {
    sessionService = new SessionService({
      authenticationProvider,
      authenticationStorage: {
        ...authenticationStorage,
        getToken: () => Promise.resolve(createToken(TWO_MINUTES_MS)),
      },
      tokenRefreshThresholdMinutes: 2,
    });

    await expect(sessionService.restore())
      .resolves
      .toEqual({ userId: '1', secret: '123' });

    expect(authenticationProvider.refresh)
      .toHaveBeenCalled();
  });

  it('should restore without refreshing token', async () => {
    sessionService = new SessionService({
      authenticationProvider,
      authenticationStorage: {
        ...authenticationStorage,
        getToken: () => Promise.resolve(createToken(TWO_MINUTES_MS)),
      },
      tokenRefreshThresholdMinutes: 1,
    });

    await expect(sessionService.restore())
      .resolves
      .toEqual({ userId: '1', secret: '123' });

    expect(authenticationProvider.refresh)
      .not
      .toHaveBeenCalled();
  });

  it('should not restore without stored token', async () => {
    await expect(sessionService.restore())
      .rejects
      .toThrow();
  });

  it('should clear storage on logout', async () => {
    await expect(sessionService.logout())
      .resolves
      .toBeUndefined();

    expect(authenticationStorage.clear)
      .toHaveBeenCalled();
  });

  it('should initialize modules on login', async () => {
    const module: ISessionModule = {
      initialize: jest.fn(() => Promise.resolve()),
      destroy: jest.fn(() => Promise.resolve()),
    };

    sessionService.addModule(module);

    await sessionService.login('test@test.com', 'password');

    expect(module.initialize)
      .toHaveBeenCalledWith({ userId: '1', secret: '123' });
  });

  it('should initialize modules on register', async () => {
    const module: ISessionModule = {
      initialize: jest.fn(() => Promise.resolve()),
      destroy: jest.fn(() => Promise.resolve()),
    };

    sessionService.addModule(module);

    await sessionService.register('test@test.com', 'password');

    expect(module.initialize)
      .toHaveBeenCalledWith({ userId: '1', secret: '123' });
  });

  it('should initialize modules on refresh', async () => {
    sessionService = new SessionService({
      authenticationProvider,
      authenticationStorage: {
        ...authenticationStorage,
        getToken: () => Promise.resolve(createToken(TWO_MINUTES_MS)),
      },
      tokenRefreshThresholdMinutes: 1,
    });

    const module: ISessionModule = {
      initialize: jest.fn(() => Promise.resolve()),
      destroy: jest.fn(() => Promise.resolve()),
    };

    sessionService.addModule(module);

    await sessionService.refresh();

    expect(module.initialize)
      .toHaveBeenCalledWith({ userId: '1', secret: '123' });
  });

  it('should initialize modules on restore', async () => {
    sessionService = new SessionService({
      authenticationProvider,
      authenticationStorage: {
        ...authenticationStorage,
        getToken: () => Promise.resolve(createToken(TWO_MINUTES_MS)),
      },
      tokenRefreshThresholdMinutes: 1,
    });

    const module: ISessionModule = {
      initialize: jest.fn(() => Promise.resolve()),
      destroy: jest.fn(() => Promise.resolve()),
    };

    sessionService.addModule(module);

    await sessionService.restore();

    expect(module.initialize)
      .toHaveBeenCalledWith({ userId: '1', secret: '123' });
  });

  it('should reject if modules fail to initialize', async () => {
    const module: ISessionModule = {
      initialize: jest.fn(() => Promise.reject(new Error('Test error'))),
      destroy: jest.fn(() => Promise.resolve()),
    };

    sessionService.addModule(module);

    await expect(sessionService.login('test@test.com', 'password'))
      .rejects
      .toThrow('Test error');
  });

  it('should destroy modules on logout', async () => {
    const module: ISessionModule = {
      initialize: jest.fn(() => Promise.resolve()),
      destroy: jest.fn(() => Promise.resolve()),
    };

    sessionService.addModule(module);

    await sessionService.logout();

    expect(module.destroy)
      .toHaveBeenCalled();
  });

  it('should reject if modules fail to destroy', async () => {
    const module: ISessionModule = {
      initialize: jest.fn(() => Promise.resolve()),
      destroy: jest.fn(() => Promise.reject(new Error('Test error'))),
    };

    sessionService.addModule(module);

    await expect(sessionService.logout())
      .rejects
      .toThrow('Test error');
  });
});
