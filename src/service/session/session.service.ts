import { ILogService } from "../log/model";
import { ISession, ISessionModule, ISessionService } from "./model";

export interface IAuthenticationToken<Payload> {
  provider: string;
  secret: string;
  userId: string;
  expiresAt: number;
  payload: Payload;
}

export type AnyAuthenticationToken = IAuthenticationToken<{}>;

export interface IAuthenticationProvider<Token extends AnyAuthenticationToken> {
  login(email: string, password: string): Promise<Token>;
  register(email: string, password: string): Promise<Token>;
  refresh(token: Token): Promise<Token>;
}

export type AnyAuthenticationProvider = IAuthenticationProvider<AnyAuthenticationToken>;

export interface IAuthenticationStorage<Token extends AnyAuthenticationToken> {
  getToken(): Promise<Token | null>;
  setToken(token: Token): Promise<void>;
  clear(): Promise<void>;
}

export type AnyAuthenticationStorage = IAuthenticationStorage<AnyAuthenticationToken>;

export interface ISessionServiceOptions<Provider extends AnyAuthenticationProvider, Storage extends AnyAuthenticationStorage> {
  tokenRefreshThresholdMinutes: number;
  authenticationProvider: Provider;
  authenticationStorage: Storage;
  logger?: ILogService;
}

export class SessionService implements ISessionService {

  private modules: ISessionModule[] = [];

  constructor(private options: ISessionServiceOptions<AnyAuthenticationProvider, AnyAuthenticationStorage>) {
  }

  public login = (email: string, password: string): Promise<ISession> => {
    return this.options.authenticationProvider.login(email, password).then(token => {
      return this.options.authenticationStorage.setToken(token).then(() => {
        const session: ISession = this.createSession(token);

        this.options.logger?.info('SessionService', `login user ${session.userId}`);

        return this.initializeModules(session)
          .then(() => session);
      });
    });
  }

  public register = (email: string, password: string): Promise<ISession> => {
    return this.options.authenticationProvider.register(email, password).then(token => {
      return this.options.authenticationStorage.setToken(token).then(() => {
        const session: ISession = this.createSession(token);

        this.options.logger?.info('SessionService', `register user ${session.userId}`);

        return this.initializeModules(session)
          .then(() => session);
      });
    });
  }

  public refresh = (): Promise<ISession> => {
    return this.options.authenticationStorage.getToken().then(token => {
      if(!token) {
        const error: string = 'Unable to refresh: no token found';
        this.options.logger?.error('SessionService', error);

        return Promise.reject(new Error(error));
      }

      return this.options.authenticationProvider.refresh(token).then(token => {
        return this.options.authenticationStorage.setToken(token).then(() => {
          const session: ISession = this.createSession(token);

          const expiresInMinutes: number = this.getExpiresInMinutes(token);
          this.options.logger?.info('SessionService', `refresh for user ${session.userId}, expires in ${expiresInMinutes} minutes`);

          return this.initializeModules(session)
            .then(() => session);
        });
      });
    });
  }

  public restore = (): Promise<ISession> => {
    return this.options.authenticationStorage.getToken().then(token => {
      if(!token) {
        const error: string = 'Unable to restore: no token found';
        this.options.logger?.error('SessionService', error);

        return Promise.reject(new Error(error));
      }

      const expiresInMinutes: number = this.getExpiresInMinutes(token);
      const isValidEnough: boolean = expiresInMinutes > this.options.tokenRefreshThresholdMinutes;

      if(!isValidEnough) {
        this.options.logger?.warn('SessionService', `token expires in less than ${this.options.tokenRefreshThresholdMinutes} minutes, refreshing`);
        return this.refresh();
      }

      const session: ISession = this.createSession(token);

      this.options.logger?.info('SessionService', `restore for user ${session.userId}, expires in ${expiresInMinutes} minutes`);

      return this.initializeModules(session)
        .then(() => session);
    });
  }

  public logout = (): Promise<void> => {
    return this.options.authenticationStorage.clear().then(() => {
      this.options.logger?.info('SessionService', `logout`);

      return this.destroyModules();
    });
  }

  public addModule = (module: ISessionModule): void => {
    this.modules.push(module);
  }

  private createSession = (token: AnyAuthenticationToken): ISession => {
    return { userId: token.userId, secret: token.secret };
  }

  private initializeModules = (session: ISession): Promise<void> => {
    const moduleInitPromises = this.modules.map(module => module.initialize(session));

    return Promise.all(moduleInitPromises)
      .then(() => {/** no-op */})
      .catch(error => {
        this.options.logger?.error('SessionService', `Failed to initialize modules: ${error.message}`);
        return Promise.reject(error);
      });
  }

  private destroyModules = (): Promise<void> => {
    const moduleDestroyPromises = this.modules.map(module => module.destroy());

    return Promise.all(moduleDestroyPromises)
      .then(() => {/** no-op */})
      .catch(error => {
        this.options.logger?.error('SessionService', `Failed to destroy modules: ${error.message}`);
        return Promise.reject(error);
      });
  }

  private getExpiresInMinutes = (token: AnyAuthenticationToken): number => {
    const expiresInMinutes: number = (token.expiresAt - Date.now()) / 60000;

    return Number(expiresInMinutes.toFixed(2));
  };
}