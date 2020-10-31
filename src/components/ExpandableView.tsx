import React, { useState } from 'react';
import { Card, Divider, LayoutProps, Text, useTheme } from '@ui-kitten/components';
import { ActivityIndicator, GestureResponderEvent, View } from 'react-native';
import { ArrowIcon } from '../Icons';
import Collapsible from 'react-native-collapsible';
import { Ionicons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';

type ExpandableViewProps = LayoutProps & {
  title: string;
  isLoading?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
};
export function ExpandableView(props: ExpandableViewProps) {

  const [isCollapsed, setIsCollapsed] = useState(true);
  const theme = useTheme();

  return (
    <Card onPress={(event) => {
      if (!props.isLoading) {
        setIsCollapsed(!isCollapsed);
        if (props.onPress)
          props.onPress(event);
      }
    }}>
      <>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text category='s1' style={props.children ? {} : {
            opacity: 0.5
          }
          }>{props.title}</Text>
          {props.isLoading ?
            <ActivityIndicator color={theme['text-basic-color']} size={25} />
            :
            <MaterialIcons name='keyboard-arrow-right' size={24} color={theme['text-basic-color']} />
          }
        </View>
        {props.children ?
          <Collapsible collapsed={isCollapsed} style={{ marginTop: 10 }}>
            <Divider style={{ marginBottom: 10 }} />
            {props.children}
          </Collapsible> :
          <></>}
      </>
    </Card>
  );
}
