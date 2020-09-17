import React from 'react';
import { Button, ButtonProps } from '@ui-kitten/components';
import { Animated } from 'react-native';
import { useRef } from 'react';

export function TabButton(props: ButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  return (
    <Animated.View style={{
      paddingHorizontal: 2,
      transform: [
        { scale: scaleAnim }
      ]
    }}>
      <Button {...props} onPressIn={() => {
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 50,
          useNativeDriver: true
        }).start();
      }} onPressOut={() => {
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true
        }).start();
      }}>
        {props.children}
      </Button>
    </Animated.View>
  );
}
