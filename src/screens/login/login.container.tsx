import React from 'react';

import { ILoginVM, Login } from './login.component';
import { LoginVM } from './login.vm';
import { NavigationScreenContainer, NavigationScreenProps } from '../../service/navigation/components/navigation-screen.container';

interface RouteParams {
}

export class LoginContainer extends NavigationScreenContainer<RouteParams> {

  private vm: ILoginVM;

  constructor(props: NavigationScreenProps<RouteParams>) {
    super(props);
    this.vm = new LoginVM(this.lifecycle);
  }

  public render(): React.ReactElement {
    return (
      <Login vm={this.vm} />
    );
  }
}
