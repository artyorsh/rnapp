import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';

import { PostItem } from './post-item.component';
import { IPostVM } from './post-item.component';
import { IPostsListVM, PostsList } from './posts-list.component';
import { IPostsListOptions, PostsListVM } from './posts-list.vm';

describe('PostItem', () => {
  let vm: IPostVM;

  beforeEach(() => {
    vm = {
      title: 'Post 1',
      body: 'Body 1',
      image: { uri: 'https://' },
      viewDetails: jest.fn(),
    };
  });

  it('should render given title', () => {
    const api = render(<PostItem vm={vm} />);
    expect(api.findByText(/Post 1/)).toBeTruthy();
  });

  it('should render given body', () => {
    const api = render(<PostItem vm={vm} />);
    expect(api.findByText(/Body 1/)).toBeTruthy();
  });

  it('should invoke viewDetails when pressed', () => {
    const api = render(
      <PostItem
        testID='post-item'
        vm={vm}
      />,
      {},
    );

    fireEvent.press(api.getByTestId('post-item'));
    expect(vm.viewDetails).toHaveBeenCalled();
  });
});

describe('PostsList', () => {

  let vm: IPostsListVM;
  let deps: IPostsListOptions;

  beforeEach(() => {
    deps = {
      logger: jest.requireMock('../../../service/log/log.service').LogService(),
    };
    vm = new PostsListVM([], deps);
  });

  it('should render given number of posts', () => {
    vm = new PostsListVM([
      { id: '1', title: 'Post 1', body: 'Body 1', image_url: 'https://' },
      { id: '2', title: 'Post 2', body: 'Body 2', image_url: 'https://' },
    ], deps);

    const api = render(<PostsList vm={vm} />);

    expect(api.getAllByTestId('post-item')).toHaveLength(2);
  });
});
