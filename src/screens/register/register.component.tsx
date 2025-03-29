import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { observer } from 'mobx-react';

import { SafeArea } from '../../components/safe-area.component';
import { NavigationBar } from '../../components/navigation-bar/navigation-bar.component';
import { NavigationBarBackAccessory } from '../../components/navigation-bar/navigation-accessory.component';
import { Text } from '../../components/text.component';
import { IRegisterFormValues, RegisterForm } from './components/register-form.component';

export interface IRegisterVM {
  title: string;
  submit(values: IRegisterFormValues): void;
  goBack(): void;
}

export const Register: React.FC<{ vm: IRegisterVM }> = observer(({ vm }) => {

  const renderBackButton = React.useCallback((props: ViewProps) => (
    <NavigationBarBackAccessory
      {...props}
      onPress={vm.goBack}
    />
  ), []);

  return (
    <SafeArea>
      <NavigationBar accessoryLeft={renderBackButton} />
      <Text
        style={styles.title}
        category='heading'>
        {vm.title}
      </Text>
      <RegisterForm 
        style={styles.registerForm}
        onSubmit={vm.submit}
      /> 
    </SafeArea>
  );
});

const styles = StyleSheet.create({
  registerForm: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
});
