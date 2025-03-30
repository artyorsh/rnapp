import { MMKV } from "react-native-mmkv";
import { IAuthenticationStorage, AnyAuthenticationToken } from "./session.service";

export interface IKeychainAuthStorageOptions {
  encryptionKey: string;
}

export class MMKVAuthenticationStorage implements IAuthenticationStorage<AnyAuthenticationToken> {

  private static KEY_TOKEN: string = 'token';

  private mmkv: MMKV;

  constructor(options: IKeychainAuthStorageOptions) {
    this.mmkv = new MMKV({
      id: 'auth-storage@rnapp',
      encryptionKey: options.encryptionKey,
    });
  }

  public getToken(): Promise<AnyAuthenticationToken | null> {
    const token = this.mmkv.getString('token');

    if(!token) {
      return Promise.resolve(null);
    }

    try {
      return Promise.resolve(JSON.parse(token));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public setToken(token: AnyAuthenticationToken): Promise<void> {
    this.mmkv.set(MMKVAuthenticationStorage.KEY_TOKEN, JSON.stringify(token));
    return Promise.resolve();
  }

  public clear(): Promise<void> {
    this.mmkv.delete(MMKVAuthenticationStorage.KEY_TOKEN);
    return Promise.resolve();
  }
}

