import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CameraPage from '../Pages/CameraPage';
import PremessionsPage from '../Pages/PremessionsPage';
import HomePage from '../Pages/HomePage';
import PageName from '../Pages/PageName';
import SettingsPage from '../Pages/SettingsPage';
import LearningSignLanguagePage from '../Pages/LearningSignLanguagePage';
import TestsPage from '../Pages/TestsPage';
import {AppProvider} from '../../Context/AppContext';
const ScreensStack = createNativeStackNavigator();
//<ScreensStack.Screen name={'meow'} component={AnimatedBackground} />
const SignifyApp = () => {
  return (
    <AppProvider>
      <NavigationContainer>
        <ScreensStack.Navigator screenOptions={{headerShown: false}}>
          <ScreensStack.Group>
            <ScreensStack.Screen name={'TestPage'} component={TestsPage} />
            <ScreensStack.Screen
              name={PageName.HomePage}
              component={HomePage}
            />
            <ScreensStack.Screen
              name={PageName.SettingsPage}
              component={SettingsPage}
            />
            <ScreensStack.Screen
              name={PageName.CameraPage}
              component={CameraPage}
            />
            <ScreensStack.Screen
              name="PremessionPage"
              component={PremessionsPage}
            />
            <ScreensStack.Screen
              name={PageName.LearningPage}
              component={LearningSignLanguagePage}
            />
          </ScreensStack.Group>
        </ScreensStack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

export default SignifyApp;
