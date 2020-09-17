import React, { useEffect, useState } from 'react';
import { LayoutProps } from '@ui-kitten/components';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Animated } from 'react-native';
import { useRef } from 'react';

export function FadeInLayout(props: LayoutProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const animate = () => {
    // return
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 50,
      useNativeDriver: true
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 50,
      useNativeDriver: true
    }).start();
  }

  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus',
      () => {
        animate()
      }
    )
    return unsubscribe
  }, [navigation])

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur',
      () => {
        scaleAnim.setValue(0.95);
        fadeAnim.setValue(0);
      }
    )
    return unsubscribe
  }, [navigation])

  return (
    <Animated.View {...props} style={{
      flex: 1,
      transform: [
        { scale: scaleAnim }
      ],
      opacity: fadeAnim
    }}>
      {props.children}
    </Animated.View>
  );
}
