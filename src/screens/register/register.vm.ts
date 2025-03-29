
import { AppModule, lazyInject } from '../../di/container';
import { INavigationService } from '../../service/navigation/model';
import { IRegisterVM } from './register.component';
import { ILogService } from '../../service/log/model';
import { INavigationScreenLifecycle } from '../../service/navigation/components/navigation-screen.container';
import { IRegisterFormValues } from './components/register-form.component';
import { ISessionService } from '../../service/session/model';

export class RegisterVM implements IRegisterVM {

  @lazyInject(AppModule.NAVIGATION) private navigation!: INavigationService;
  @lazyInject(AppModule.LOG) private log!: ILogService;
  @lazyInject(AppModule.SESSION) private session!: ISessionService;
  public readonly title = 'Register';

  constructor(_lifecycle: INavigationScreenLifecycle) {

  }

  
  public submit = (values: IRegisterFormValues): void => {
    this.session.register(values.email, values.password).then(() => {
      this.navigation.replace('/overview');
    });
  }

  public goBack = (): void => {
    this.navigation.goBack();
  }

}
