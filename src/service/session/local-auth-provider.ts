import { IAuthenticationProvider, IAuthenticationToken } from "./session.service";

type ILocalAuthenticationToken = IAuthenticationToken<{
  token: string;
  refreshToken: string;
}>;

export class LocalAuthenticationProvider implements IAuthenticationProvider<ILocalAuthenticationToken> {

  public login(_email: string, _password: string): Promise<ILocalAuthenticationToken> {
    return this.resolveAfter(1000)
      .then(() => this.createSampleToken());
  }

  public register(_email: string, _password: string): Promise<ILocalAuthenticationToken> {
    return this.resolveAfter(1000)
      .then(() => this.createSampleToken());
  }

  public refresh(_token: ILocalAuthenticationToken): Promise<ILocalAuthenticationToken> {
    return this.resolveAfter(1000)
      .then(() => this.createSampleToken());
  }

  private createSampleToken(): ILocalAuthenticationToken {
    const fifteenMinutesInMs: number = 15 * 60 * 1000;

    return {
      provider: 'auth-api',
      secret: '123',
      expiresAt: Date.now() + fifteenMinutesInMs,
      userId: '1',
      payload: {
        token: '123',
        refreshToken: '456',
      },
    };
  }

  private resolveAfter(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

