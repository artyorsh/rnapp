import { INavigationService } from '../../service/navigation/model';
import { ILoginVM } from './login.component';
import { INavigationScreenLifecycle } from '../../service/navigation/components/navigation-screen.container';
import { ILoginFormValues } from './components/login-form.component';
import { ISessionService } from '../../service/session/model';

interface ILoginOptions {
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
    });
  }

  public goBack = (): void => {
    this.navigation.goBack();
  }

}
