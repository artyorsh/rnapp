import { computed, makeAutoObservable, observable } from 'mobx';

import { ILogService } from '@service/log/model';
import { INavigationScreenLifecycle, INavigationScreenLifecycleListener } from '@service/navigation/components/navigation-screen.container';
import { INavigationService } from '@service/navigation/model';
import { ISessionService } from '@service/session/model';
import { IUserService } from '@service/user/model';

import { IHomeVM } from './home.component';
import { IPost } from './posts-list/model';
import { IPostsListVM } from './posts-list/posts-list.component';
import { IPostsListOptions, PostsListVM } from './posts-list/posts-list.vm';
import { IWelcomeHeaderVM } from './welcome-header/welcome-header.component';

export interface IHomeOptions extends IPostsListOptions {
  session: ISessionService;
  navigation: INavigationService;
  user: IUserService;
  api: IHomeAPI;
}

export interface IHomeAPI {
  getPosts(): Promise<IPost[]>;
}

export class HomeVM implements IHomeVM, INavigationScreenLifecycleListener {

  private sessionService: ISessionService;
  private userService: IUserService;
  private navigationService: INavigationService;
  private logService: ILogService;

  private api: IHomeAPI;

  @observable public posts!: IPostsListVM;

  @computed public get loading(): boolean {
    return !this.posts;
  }

  @computed public get welcomeHeader(): IWelcomeHeaderVM {
    return {
      title: `Hello, ${this.userService.getUser().name}`,
      logout: this.logout,
    };
  }

  constructor(lifecycle: INavigationScreenLifecycle, options: IHomeOptions) {
    this.sessionService = options.session;
    this.userService = options.user;
    this.navigationService = options.navigation;
    this.logService = options.logger;
    this.api = options.api;

    lifecycle.subscribe(this);
    makeAutoObservable(this);
  }

  public onMount = async (): Promise<void> => {
    const posts = await this.api.getPosts();
    this.posts = new PostsListVM(posts, { logger: this.logService });
  };

  public logout = (): void => {
    this.sessionService.logout().then(() => {
      this.navigationService.replace('/welcome');
    }).catch(() => {
      /* no-op */
    });
  };
}
