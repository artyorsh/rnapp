import React from 'react';
import { NavigationContainer, NavigationContainerProps } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StackNavigator } from './stack-navigator';
import { AuthNavigator } from './auth-navigator';

export type RootRoute =
  | '/auth'
  | '/home';

export const RootScreens: Record<RootRoute, React.ComponentType<any>> = {
  '/auth': AuthNavigator,
  '/home': StackNavigator,
};

const Stack = createNativeStackNavigator();

export type RootNavigatorProps = Omit<NavigationContainerProps, 'children'>;

const createScreen = (name: string, index: number): React.ReactElement => (
  <Stack.Screen
    key={index}
    name={name}
    component={RootScreens[name as RootRoute]}
  />
);

export const RootNavigator = React.forwardRef((props: RootNavigatorProps, ref) => {

  return (
    <NavigationContainer
      ref={ref as any}
      {...props}>
      <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false, animation: 'fade' }}>
        {Object.keys(RootScreens).map(createScreen)}
      </Stack.Navigator>
    </NavigationContainer>
  );
});
