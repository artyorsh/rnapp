import React from 'react';

import { AppModule, container } from '@di/container';
import { NavigationScreenContainer, NavigationScreenProps } from '@service/navigation/components/navigation-screen.container';

import { IWelcomeVM, Welcome } from './welcome.component';
import { WelcomeVM } from './welcome.vm';

interface RouteParams {
}

export class WelcomeContainer extends NavigationScreenContainer<RouteParams> {

  private vm: IWelcomeVM;

  constructor(props: NavigationScreenProps<RouteParams>) {
    super(props);
    this.vm = new WelcomeVM(this.lifecycle, {
      navigation: container.get(AppModule.NAVIGATION),
    });
  }

  public render(): React.ReactElement {
    return (
      <Welcome vm={this.vm} />
    );
  }
}
