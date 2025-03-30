import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Input } from '../../../components/input.component';
import { Button } from '../../../components/button.component';

export interface ILoginFormValues {
  email: string;
  password: string;
}

interface Props extends ViewProps {
  initialValues: ILoginFormValues;
  onSubmit: (values: ILoginFormValues) => void;
} 

export const LoginForm: React.FC<Props> = ({ initialValues, onSubmit, ...props }) => {

  const [email, setEmail] = React.useState(initialValues.email);
  const [password, setPassword] = React.useState(initialValues.password);

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
        title='Login'
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
