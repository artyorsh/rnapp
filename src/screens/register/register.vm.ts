import { INavigationService } from '../../service/navigation/model';
import { IRegisterVM } from './register.component';
import { INavigationScreenLifecycle } from '../../service/navigation/components/navigation-screen.container';
import { IRegisterFormValues } from './components/register-form.component';
import { ISessionService } from '../../service/session/model';

export interface IRegisterOptions {
  session: ISessionService;
  navigation: INavigationService;
}

export class RegisterVM implements IRegisterVM {

  private session: ISessionService;
  private navigation: INavigationService;

  public readonly title = 'Register';

  constructor(_lifecycle: INavigationScreenLifecycle, options: IRegisterOptions) {
    this.session = options.session;
    this.navigation = options.navigation;
  }

  
  public submit = (values: IRegisterFormValues): void => {
    this.session.register(values.email, values.password).then(() => {
      this.navigation.replace('/home');
    }).catch(() => {
      /* no-op */
    });
  }

  public goBack = (): void => {
    this.navigation.goBack();
  }

}
