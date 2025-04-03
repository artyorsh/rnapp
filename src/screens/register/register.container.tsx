import React from 'react';

import { AppModule, container } from '@di/container';
import { NavigationScreenContainer, NavigationScreenProps } from '@service/navigation/components/navigation-screen.container';

import { IRegisterVM, Register } from './register.component';
import { RegisterVM } from './register.vm';

interface RouteParams {
}

export class RegisterContainer extends NavigationScreenContainer<RouteParams> {

  private vm: IRegisterVM;

  constructor(props: NavigationScreenProps<RouteParams>) {
    super(props);
    this.vm = new RegisterVM(this.lifecycle, {
      session: container.get(AppModule.SESSION),
      navigation: container.get(AppModule.NAVIGATION),
    });
  }

  public render(): React.ReactElement {
    return (
      <Register vm={this.vm} />
    );
  }
}
