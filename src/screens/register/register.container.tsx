import React from 'react';

import { IRegisterVM, Register } from './register.component';
import { RegisterVM } from './register.vm';
import { NavigationScreenContainer, NavigationScreenProps } from '../../service/navigation/components/navigation-screen.container';

interface RouteParams {
}

export class RegisterContainer extends NavigationScreenContainer<RouteParams> {

  private vm: IRegisterVM;

  constructor(props: NavigationScreenProps<RouteParams>) {
    super(props);
    this.vm = new RegisterVM(this.lifecycle);
  }

  public render(): React.ReactElement {
    return (
      <Register vm={this.vm} />
    );
  }
}
