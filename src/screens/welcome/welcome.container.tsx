import React from 'react';

import { IWelcomeVM, Welcome } from './welcome.component';
import { WelcomeVM } from './welcome.vm';
import { NavigationScreenContainer, NavigationScreenProps } from '../../service/navigation/components/navigation-screen.container';

interface RouteParams {
}

export class WelcomeContainer extends NavigationScreenContainer<RouteParams> {

  private vm: IWelcomeVM;

  constructor(props: NavigationScreenProps<RouteParams>) {
    super(props);
    this.vm = new WelcomeVM(this.lifecycle);
  }

  public render(): React.ReactElement {
    return (
      <Welcome vm={this.vm} />
    );
  }
}
