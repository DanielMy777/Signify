import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CameraPage from '../Pages/CameraPage';
import PremessionsPage from '../Pages/PremessionsPage';
const ScreensStack = createNativeStackNavigator();

const SignifyApp = () => {
  return (
    <NavigationContainer>
      <ScreensStack.Navigator screenOptions={{headerShown: false}}>
        <ScreensStack.Group>
          <ScreensStack.Screen name="CameraPage" component={CameraPage} />
          <ScreensStack.Screen
            name="PremessionPage"
            component={PremessionsPage}
          />
        </ScreensStack.Group>
      </ScreensStack.Navigator>
    </NavigationContainer>
  );
};

export default SignifyApp;
