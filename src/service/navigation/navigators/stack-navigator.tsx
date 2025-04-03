import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeContainer } from '@screens/home/home.container';

export type StackRoute =
  | '/home';

export const StackScreens: Record<StackRoute, React.ComponentType<any>> = {
  '/home': HomeContainer,
};

const Stack = createNativeStackNavigator();

const createScreen = (name: string, index: number): React.ReactElement => (
  <Stack.Screen
    key={index}
    name={name}
    component={StackScreens[name as StackRoute]}
  />
);

export const StackNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    {Object.keys(StackScreens).map(createScreen)}
  </Stack.Navigator>
);
