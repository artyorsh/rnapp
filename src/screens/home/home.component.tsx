import React from 'react';
import { StyleSheet } from 'react-native';
import { observer } from 'mobx-react';

import { Loading } from '../../components/loading.component';
import { SafeArea } from '../../components/safe-area.component';
import { IPostsListVM, PostsList } from './posts-list/posts-list.component';
import { IWelcomeHeaderVM, WelcomeHeader } from './welcome-header/welcome-header.component';

export interface IHomeVM {
  loading: boolean;
  welcomeHeader: IWelcomeHeaderVM;
  posts: IPostsListVM;
}

export const Home: React.FC<{ vm: IHomeVM }> = observer(({ vm }) => {

  return (
    <SafeArea style={styles.safeArea}>
      <WelcomeHeader vm={vm.welcomeHeader} />
      <Loading loading={vm.loading}>
        <PostsList vm={vm.posts} />
      </Loading>
    </SafeArea>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
