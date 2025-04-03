import { computed } from 'mobx';

import { ILogService } from '@service/log/model';

import { IPost } from './model';
import { IPostVM } from './post-item.component';
import { IPostsListVM } from './posts-list.component';

export interface IPostsListOptions {
  logger: ILogService;
}

export class PostsListVM implements IPostsListVM {

  private logger: ILogService;

  constructor(private data: IPost[], options: IPostsListOptions) {
    this.logger = options.logger;
  }

  @computed public get posts(): IPostVM[] {
    return this.data
      .map((post) => this.createPostVM(post));
  }

  private createPostVM = (post: IPost): IPostVM => {
    return {
      title: post.title,
      body: post.body,
      image: { uri: post.image_url },
      viewDetails: () => {
        this.logger.info('PostsListVM', `viewDetails: ${post.id}`);
      },
    };
  };
}
