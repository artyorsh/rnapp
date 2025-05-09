import { ISessionService } from '@/auth/session';
import { IRouter } from '@/router';

import { IRegisterFormValues } from './components/register-form.component';
import { IRegisterVM } from './register.component';

export class RegisterVM implements IRegisterVM {

  public readonly title = 'Register';

  constructor(private router: IRouter, private sessionService: ISessionService) {
  }

  public submit = (values: IRegisterFormValues): void => {
    this.sessionService.register(values.email, values.password).then(() => {
      this.router.replace('/home');
    }).catch(() => {
      /* no-op */
    });
  };

  public goBack = (): void => {
    this.router.goBack();
  };

}
