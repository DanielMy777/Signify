import {
  SafeAreaView,
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import PageName from './PageName';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import FullScreenBackground from '../General/FullScreenBackground';
import {AnimatedBackground} from '../General/AnimatedBackground';
import Orientation from 'react-native-orientation-locker';
const backGroundImg = require('../../../resources/images/HomePageBackground2.jpg');
import KeepAwake from 'react-native-keep-awake';
import HomePageButtons from '../General/HomePageButtons';

const HomePage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    Orientation.lockToPortrait();
    KeepAwake.activate();
    // console.log('hey');
    return () => {
      //Orientation.unlockAllOrientations();
      //KeepAwake.deactivate()
    };
  });
  const handleLiveTranslateButtonClicked = () => {
    navigation.navigate(PageName.CameraPage);
  };
  const handleLearnSignLanguageButtonClicked = () => {
    navigation.navigate(PageName.LearningPage);
  };

  const handleSettingsButtonClicked = () => {
    navigation.navigate(PageName.SettingsPage);
  };
  //<MaterialIcons name="arrow-forward-ios" color="#fff" size={15} />
  return (
    <AnimatedBackground>
      <SafeAreaView style={styles.container}>
        <HomePageButtons
          onPress={handleLiveTranslateButtonClicked}
          style={styles.button}
          Text="Live Translation"
        />

        <HomePageButtons
          onPress={handleLearnSignLanguageButtonClicked}
          style={styles.button}
          Text="Learn Sign Language"
        />
        <HomePageButtons
          Text="Settings"
          onPress={handleSettingsButtonClicked}
          style={styles.button}
        />
      </SafeAreaView>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    top: '5%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#20315f',
  },
  button: {
    marginBottom: 10,
    alignItems: 'center',
    width: '80%',
  },
});
export default HomePage;
