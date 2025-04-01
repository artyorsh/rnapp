import { INavigationScreenLifecycle } from '../../service/navigation/components/navigation-screen.container';
import { INavigationService } from '../../service/navigation/model';
import { ISessionService } from '../../service/session/model';
import { ILoginFormValues } from './components/login-form.component';
import { ILoginVM } from './login.component';

export interface ILoginOptions {
  session: ISessionService;
  navigation: INavigationService;
}

export class LoginVM implements ILoginVM {

  private session: ISessionService;
  private navigation: INavigationService;

  public readonly title = 'Login';

  public readonly initialValues: ILoginFormValues = {
    email: 'test@test.com',
    password: 'password',
  };

  constructor(_lifecycle: INavigationScreenLifecycle, options: ILoginOptions) {
    this.session = options.session;
    this.navigation = options.navigation;
  }

  public submit = (values: ILoginFormValues): void => {
    this.session.login(values.email, values.password).then(() => {
      this.navigation.replace('/home');
    }).catch(() => {
      /* no-op */
    });
  };

  public goBack = (): void => {
    this.navigation.goBack();
  };

}
