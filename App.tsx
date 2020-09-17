import React from 'react';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, Divider, IconRegistry, Layout } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';

import { HomeIcon, SettingsIcon } from './src/Icons';
import { TabButton } from './src/components/TabButton';
import { HomeStackScreen } from './src/screens/ProjectScreen';
import { SettingsStackScreen } from './src/screens/SettingsScreen';


function BottomTabBar({ navigation, state }: BottomTabBarProps) {
  const navigate = (index: number) => navigation.navigate(state.routeNames[index]);
  return (
    <SafeAreaView edges={['right', 'bottom', 'left']}>
      <Divider />
      <Layout style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
      }}>
        <TabButton
          appearance={state.index == 0 ? 'outline' : 'ghost'}
          accessoryLeft={HomeIcon}
          onPress={() => {
            navigate(0)
          }} />
        <TabButton
          appearance={state.index == 1 ? 'outline' : 'ghost'}
          accessoryLeft={SettingsIcon}
          onPress={() => { navigate(1) }}
        />
      </Layout>
    </SafeAreaView>
  );
}

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator tabBar={BottomTabBar} >
      <Tab.Screen name='Home' component={HomeStackScreen} />
      <Tab.Screen name='Settings' component={SettingsStackScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <SafeAreaProvider>
          <NavigationContainer>
            <TabNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </ApplicationProvider>
      <StatusBar style="auto" />
    </>
  );
}