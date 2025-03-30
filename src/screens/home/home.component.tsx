import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';

import { SafeArea } from '../../components/safe-area.component';
import { NavigationBar } from '../../components/navigation-bar/navigation-bar.component';
import { Text } from '../../components/text.component';
import { Button } from '../../components/button.component';

export interface IHomeVM {
  title: string;
  logout: () => void;
}

export const Home: React.FC<{ vm: IHomeVM }> = observer(({ vm }) => {
  return (
    <SafeArea style={styles.safeArea}>
      <NavigationBar />
      <View style={styles.container}>
        <Text category='heading'>
          {vm.title}
        </Text>
        <Button
          title='Logout'
          onPress={vm.logout}
        />
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
});
