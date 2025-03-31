import { computed } from 'mobx';

import { IHomeVM } from './home.component';
import { INavigationScreenLifecycle } from '../../service/navigation/components/navigation-screen.container';
import { ISessionService } from '../../service/session/model';
import { INavigationService } from '../../service/navigation/model';
import { IUserService } from '../../service/user/model';

export interface IHomeOptions {
  session: ISessionService;
  navigation: INavigationService;
  user: IUserService;
}

export class HomeVM implements IHomeVM {

  private sessionService: ISessionService;
  private userService: IUserService;
  private navigationService: INavigationService;

  @computed public get title(): string {
    return `Hello, ${this.userService.getUser().name}`;
  }

  constructor(_lifecycle: INavigationScreenLifecycle, options: IHomeOptions) {
    this.sessionService = options.session;
    this.userService = options.user;
    this.navigationService = options.navigation;
  }

  public logout = (): void => {
    this.sessionService.logout().then(() => {
      this.navigationService.replace('/welcome');
    }).catch(() => {
      /* no-op */
    });
  }
}
