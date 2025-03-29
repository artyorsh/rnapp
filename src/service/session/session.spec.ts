import { AnyAuthenticationProvider, AnyAuthenticationStorage, SessionService } from "./session.service";

import { AnyAuthenticationToken } from "./session.service";

describe('SessionService', () => {

  const TWO_MINUTES_MS: number = 2 * 60 * 1000;

  const createToken = (validMs: number): AnyAuthenticationToken => ({
    provider: 'local',
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
      .toBeUndefined()
  });

  it('should register', async () => {
    await expect(sessionService.register('test@test.com', 'password'))
      .resolves
      .toBeUndefined()
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
      .toBeUndefined()
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
      .toBeUndefined();

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
      .toBeUndefined();

    expect(authenticationProvider.refresh)
      .not
      .toHaveBeenCalled();
  });

  it('should not restore without stored token', async () => {
    await expect(sessionService.restore())
      .rejects
      .toThrow();
  });
});

