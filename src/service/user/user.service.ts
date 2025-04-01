import { ILogService } from '../log/model';
import { ISession, ISessionModule, ISessionService } from '../session/model';
import { IUser, IUserService } from './model';

export interface IUserRepository {
  getUser(userId: string): Promise<IUser>;
}

export interface IUserServiceOptions {
  sessionService: ISessionService;
  userRepository: IUserRepository;
  logger: ILogService;
}

export class UserService implements IUserService, ISessionModule {

  private user: IUser | null = null;

  constructor(private options: IUserServiceOptions) {
    this.options.sessionService.addModule(this);
  }

  public getUser = (): IUser => {
    if (!this.user) {
      throw new Error('User not found. Was the session initialized?');
    }

    return this.user;
  };

  public initialize = (session: ISession): Promise<void> => {
    return this.options.userRepository.getUser(session.userId).then(user => {
      this.user = user;
      this.options.logger.addLabel('user_id', user.id);
    });
  };

  public destroy = (): Promise<void> => {
    this.user = null;

    return Promise.resolve();
  };
}
