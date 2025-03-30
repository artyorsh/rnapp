import { AppModule, lazyInject } from '../../di/container';
import { INavigationService } from '../../service/navigation/model';
import { INavigationScreenLifecycle, INavigationScreenLifecycleListener } from '../../service/navigation/components/navigation-screen.container';
import { ISplashVM } from './splash.component';
import { ISessionService } from '../../service/session/model';

export class SplashVM implements ISplashVM, INavigationScreenLifecycleListener {

  @lazyInject(AppModule.NAVIGATION) private navigation!: INavigationService;
  @lazyInject(AppModule.SESSION) private session!: ISessionService;

  public readonly title = 'Hello';

  constructor(lifecycle: INavigationScreenLifecycle) {
    lifecycle.subscribe(this)
  }

  public onMount = (): void => {
    this.session.restore().then(() => {
      this.navigation.replace('/home');
    }).catch(() => {
      this.navigation.replace('/welcome');
    });
  }
}
