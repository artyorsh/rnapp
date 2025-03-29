import { ILogService } from "../log/model";
import { ISessionService } from "./model";

export interface IAuthenticationToken<Payload> {
  provider: string;
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
}

export type AnyAuthenticationStorage = IAuthenticationStorage<AnyAuthenticationToken>;

export interface ISessionServiceOptions<Provider extends AnyAuthenticationProvider, Storage extends AnyAuthenticationStorage> {
  tokenRefreshThresholdMinutes: number;
  authenticationProvider: Provider;
  authenticationStorage: Storage;
  logger?: ILogService;
}

export class SessionService implements ISessionService {

  constructor(private options: ISessionServiceOptions<AnyAuthenticationProvider, AnyAuthenticationStorage>) {
  }

  public login = (email: string, password: string): Promise<void> => {
    return this.options.authenticationProvider.login(email, password).then(token => {
      return this.options.authenticationStorage.setToken(token).then(() => {
        this.options.logger?.info('SessionService', `login user ${token.userId}`);
      });
    });
  }

  public register = (email: string, password: string): Promise<void> => {
    return this.options.authenticationProvider.register(email, password).then(token => {
      return this.options.authenticationStorage.setToken(token).then(() => {
        this.options.logger?.info('SessionService', `register user ${token.userId}`);
      });
    });
  }

  public refresh = (): Promise<void> => {
    return this.options.authenticationStorage.getToken().then(token => {
      if(!token) {
        const error: string = 'Unable to refresh: no token found';
        this.options.logger?.error('SessionService', error);

        return Promise.reject(new Error(error));
      }

      return this.options.authenticationProvider.refresh(token).then(token => {
        return this.options.authenticationStorage.setToken(token).then(() => {
          const expiresInMinutes: number = this.getExpiresInMinutes(token);
          this.options.logger?.info('SessionService', `refresh for user ${token.userId}, expires in ${expiresInMinutes} minutes`);
        });
      });
    });
  }

  public restore = (): Promise<void> => {
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

      this.options.logger?.info('SessionService', `restore for user ${token.userId}, expires in ${expiresInMinutes} minutes`);
    });
  }

  private getExpiresInMinutes = (token: AnyAuthenticationToken): number => {
    const expiresInMinutes: number = (token.expiresAt - Date.now()) / 60000;

    return Number(expiresInMinutes.toFixed(2));
  };
}