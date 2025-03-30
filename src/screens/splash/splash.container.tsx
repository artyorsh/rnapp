import React from 'react';

import { ISplashVM, Splash } from './splash.component';
import { SplashVM } from './splash.vm';
import { NavigationScreenContainer, NavigationScreenProps } from '../../service/navigation/components/navigation-screen.container';
import { AppModule, container } from '../../di/container';

interface RouteParams {
}

export class SplashContainer extends NavigationScreenContainer<RouteParams> {

  private vm: ISplashVM;

  constructor(props: NavigationScreenProps<RouteParams>) {
    super(props);
    this.vm = new SplashVM(this.lifecycle, {
      navigation: container.get(AppModule.NAVIGATION),
      session: container.get(AppModule.SESSION),
    });
  }

  public render(): React.ReactElement {
    return (
      <Splash vm={this.vm} />
    );
  }
}
