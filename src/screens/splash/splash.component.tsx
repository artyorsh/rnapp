import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';

import { SafeArea } from '@components/safe-area.component';
import { Text } from '@components/text.component';

export interface ISplashVM {
  title: string;
}

export const Splash: React.FC<{ vm: ISplashVM }> = observer(({ vm }) => {

  return (
    <SafeArea style={styles.safeArea}>
      <View style={styles.container}>
        <Text
          style={styles.title}
          category='heading'>
          {vm.title}
        </Text>
      </View>
    </SafeArea>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
});
