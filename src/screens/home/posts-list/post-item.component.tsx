import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View, ViewProps } from 'react-native';

import { Card } from '@components/card.component';
import { Text } from '@components/text.component';

interface Props extends ViewProps {
  vm: IPostVM;
}

export interface IPostVM {
  title: string;
  body: string;
  image: ImageSourcePropType;
  viewDetails(): void;
}

export const PostItem: React.FC<Props> = ({ vm, ...props }) => {
  return (
    <Card
      {...props}
      style={[styles.container, props.style]}
      onPress={() => vm.viewDetails()}>
      <Image
        style={styles.image}
        source={vm.image}
      />
      <View style={styles.content}>
        <Text category='heading'>
          {vm.title}
        </Text>
        <Text category='paragraph'>
          {vm.body}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    height: 192,
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
