import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export interface INavigationScreenLifecycle {
  subscribe(listener: INavigationScreenLifecycleListener): void;
}

export interface INavigationScreenLifecycleListener {
  onMount?(): void;
  onFocus?(): void;
  onBlur?(): void;
  onUnmount?(): void;
}

export type NavigationScreenProps<Params extends object> = NativeStackScreenProps<{ Self: Params }, 'Self'>;

export abstract class NavigationScreenContainer<RouteParams extends object = {}> extends React.Component<NavigationScreenProps<RouteParams>> {

  public lifecycle: INavigationScreenLifecycle;

  private lifecycleListener?: INavigationScreenLifecycleListener;
  private removeFocusSubscription?: Function;
  private removeBlurSubscription?: Function;

  constructor(props: NavigationScreenProps<RouteParams>) {
    super(props);

    this.lifecycle = {
      subscribe: (listener: INavigationScreenLifecycleListener) => {
        this.lifecycleListener = listener;
        this.removeFocusSubscription = props.navigation.addListener('focus', () => this.lifecycleListener?.onFocus?.());
        this.removeBlurSubscription = props.navigation.addListener('blur', () => this.lifecycleListener?.onBlur?.());
      },
    };
  }

  public componentDidMount(): void {
    super.componentDidMount?.();
    this.lifecycleListener?.onMount?.();
  }

  public componentWillUnmount(): void {
    this.lifecycleListener?.onUnmount?.();

    this.removeFocusSubscription?.();
    this.removeBlurSubscription?.();
    this.lifecycleListener = undefined;

    super.componentWillUnmount?.();
  }
}
