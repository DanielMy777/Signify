import {
  View,
  Text,
  Button,
  SafeAreaView,
  Touchable,
  StyleSheet,
} from 'react-native';

import React from 'react';
import {useNavigation} from '@react-navigation/native';
import PageName from './PageName';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import AwesomeButton from 'react-native-really-awesome-button';
import FullScreenBackground from '../General/FullScreenBackground';
import SignifyHeader from '../General/SignifyHeader';
const backGroundImg = require('../../../resources/images/HomePageBackground2.jpg');

const HomePage = () => {
  const navigation = useNavigation();
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
    <FullScreenBackground source={backGroundImg}>
      <SignifyHeader fontSize={80} />
      <SafeAreaView style={styles.container}>
        <AwesomeButtonRick
          type="primary"
          onPress={handleLiveTranslateButtonClicked}
          backgroundColor="yellow"
          textColor="black"
          backgroundDarker={null}>
          Live Translation
        </AwesomeButtonRick>

        <AwesomeButtonRick
          type="primary"
          onPress={handleLearnSignLanguageButtonClicked}
          backgroundColor="red"
          textColor="black"
          backgroundDarker={null}>
          Learn Sign Language
        </AwesomeButtonRick>
        <AwesomeButtonRick
          type="primary"
          onPress={handleSettingsButtonClicked}
          backgroundColor="gray"
          textColor="white"
          backgroundDarker={null}>
          Settings
        </AwesomeButtonRick>
      </SafeAreaView>
    </FullScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#20315f',
  },
});
export default HomePage;
