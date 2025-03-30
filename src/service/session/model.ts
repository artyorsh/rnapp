export interface ISessionService {
  login(email: string, password: string): Promise<void>;
  register(email: string, password: string): Promise<void>;
  refresh(): Promise<void>;
  restore(): Promise<void>;
  logout(): Promise<void>;
}