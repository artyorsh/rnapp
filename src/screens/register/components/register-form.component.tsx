import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { Button } from '@components/button.component';
import { Input } from '@components/input.component';

export interface IRegisterFormValues {
  email: string;
  password: string;
}

interface Props extends ViewProps {
  onSubmit(values: IRegisterFormValues): void;
}

export const RegisterForm: React.FC<Props> = ({ onSubmit, ...props }) => {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <View {...props}>
      <Input
        testID='email-input'
        style={styles.input}
        value={email}
        placeholder='Email'
        keyboardType='email-address'
        onChangeText={setEmail}
      />
      <Input
        testID='password-input'
        style={styles.input}
        value={password}
        placeholder='Password'
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      <Button
        testID='submit-button'
        style={styles.submitButton}
        title='Register'
        onPress={() => onSubmit({ email, password })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginTop: 12,
  },
  submitButton: {
    marginTop: 12,
  },
});
