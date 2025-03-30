import { AppModule, lazyInject } from '../../di/container';
import { INavigationService } from '../../service/navigation/model';
import { INavigationScreenLifecycle } from '../../service/navigation/components/navigation-screen.container';
import { IWelcomeVM } from './welcome.component';

interface IWelcomeOptions {
  navigation: INavigationService;
}

export class WelcomeVM implements IWelcomeVM {

  private navigation: INavigationService;

  public readonly title = 'Welcome';

  constructor(_lifecycle: INavigationScreenLifecycle, options: IWelcomeOptions) {
    this.navigation = options.navigation;
  }
  
  public login = (): void => {
    this.navigation.goTo('/login');
  }

  public register = (): void => {
    this.navigation.goTo('/register');
  }
}
