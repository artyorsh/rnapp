import React from 'react';

import { AppModule, container } from '../../di/container';
import { NavigationScreenContainer, NavigationScreenProps } from '../../service/navigation/components/navigation-screen.container';
import { ILoginVM, Login } from './login.component';
import { LoginVM } from './login.vm';

interface RouteParams {
}

export class LoginContainer extends NavigationScreenContainer<RouteParams> {

  private vm: ILoginVM;

  constructor(props: NavigationScreenProps<RouteParams>) {
    super(props);
    this.vm = new LoginVM(this.lifecycle, {
      session: container.get(AppModule.SESSION),
      navigation: container.get(AppModule.NAVIGATION),
    });
  }

  public render(): React.ReactElement {
    return (
      <Login vm={this.vm} />
    );
  }
}
