import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { Card as RNPCard } from 'react-native-paper';

export interface CardProps extends TouchableOpacityProps {
}

type RNPCardProps = React.ComponentProps<typeof RNPCard>;

export const Card: React.FC<CardProps> = (props) => (
  <RNPCard {...props as RNPCardProps} />
);
