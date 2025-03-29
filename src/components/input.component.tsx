import React from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';

interface InputProps extends TextInputProps {}

export const Input: React.FC<InputProps> = (props) => {
  return (
    <TextInput
      {...props}
    />
  );
};
