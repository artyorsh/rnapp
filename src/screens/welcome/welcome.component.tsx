import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';

import { SafeArea } from '../../components/safe-area.component';
import { Button } from '../../components/button.component';
import { Text } from '../../components/text.component';

export interface IWelcomeVM {
  title: string;
  login(): void;
  register(): void;
}

export const Welcome: React.FC<{ vm: IWelcomeVM }> = observer(({ vm }) => {

  return (
    <SafeArea>
      <View style={styles.container}>
        <Text 
          style={styles.title}
          category='heading'>
          {vm.title}
        </Text>
        <Button
          title='Register'
          onPress={() => vm.register()}
        />
        <Button
          title='Login'
          onPress={() => vm.login()}
        />
      </View>
    </SafeArea>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
});
