import { INavigationScreenLifecycle, INavigationScreenLifecycleListener } from '@service/navigation/components/navigation-screen.container';
import { INavigationService } from '@service/navigation/model';
import { ISessionService } from '@service/session/model';

import { ISplashVM } from './splash.component';

export interface ISplashOptions {
  navigation: INavigationService;
  session: ISessionService;
}

export class SplashVM implements ISplashVM, INavigationScreenLifecycleListener {

  private navigation: INavigationService;
  private session: ISessionService;

  public readonly title = 'Hello';

  constructor(lifecycle: INavigationScreenLifecycle, options: ISplashOptions) {
    this.navigation = options.navigation;
    this.session = options.session;

    lifecycle.subscribe(this);
  }

  public onMount = (): void => {
    this.session.restore().then(() => {
      this.navigation.replace('/home');
    }).catch(() => {
      this.navigation.replace('/welcome');
    });
  };
}
