import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

import { makeLazyInject } from './inject';

export enum AppModule {
  NAVIGATION = 'navigation',
  LOG = 'log',
  SESSION = 'session',
  USER = 'user'
}

export const container = new Container({ defaultScope: 'Singleton' });
export const lazyInject = makeLazyInject(() => getDecorators(container).lazyInject);

container.load(...require('./bindings').createModules());
