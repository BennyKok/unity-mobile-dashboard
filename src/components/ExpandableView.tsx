import React, { useState } from 'react';
import { Card, Divider, LayoutProps, Text } from '@ui-kitten/components';
import { ActivityIndicator, GestureResponderEvent, View } from 'react-native';
import { ArrowIcon } from '../Icons';
import Collapsible from 'react-native-collapsible';

type ExpandableViewProps = LayoutProps & {
  title: string;
  isLoading?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
};
export function ExpandableView(props: ExpandableViewProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
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

          <Text category='s1'>{props.title}</Text>
          {props.isLoading ?
            <ActivityIndicator size={25} />
            :
            <ArrowIcon style={{
              width: 25,
              height: 25,
            }} />}
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
