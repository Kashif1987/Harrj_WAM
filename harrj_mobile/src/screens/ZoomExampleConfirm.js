import * as React from 'react';
import { ZoomVideoSdkProvider } from '@zoom/react-native-videosdk';
import { NavigationContainer } from '@react-navigation/native';
import { IntroScreen } from './../screens/intro-screen';
import { JoinScreen } from './../screens/join-screen';
import { CallScreen } from './../screens/call-screen';
import { MenuDrawer } from './../components/menu-drawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function MainNavigation() {
  return (
    <Stack.Navigator initialRouteName="Join">
      <Stack.Screen
        name="Intro"
        component={IntroScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Join"
        component={JoinScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Call"
        component={CallScreen}
        options={{ title: '', headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function ZoomExampleConfirm() {
  return (
    <NavigationContainer>
      <ZoomVideoSdkProvider
        config={{
          appGroupId: '',
          domain: 'zoom.us',
          enableLog: true,
        }}
      >
        {/* <Drawer.Navigator initialRouteName="Main" drawerContent={MenuDrawer}>
          <Drawer.Screen name="Main" component={MainNavigation} />
        </Drawer.Navigator> */}

        <MainNavigation />
      </ZoomVideoSdkProvider>
    </NavigationContainer>
  );
}
