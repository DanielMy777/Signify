import {View, StyleSheet, Text} from 'react-native';
import React, {useState, useContext} from 'react';
import {AnimatedBackground} from '../General/AnimatedBackground';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {AppContext} from '../../Context/AppContext';

const SettingsPage = () => {
  const {
    heabrewDetectionEnabled,
    setHeabrewDetectionEnabled,
    learningSoundEffectsEnabled,
    setLearningSoundEffectsEnabled,
  } = useContext(AppContext);
  return (
    <AnimatedBackground animation={false}>
      <View style={styles.container}>
        <BouncyCheckbox
          size={25}
          fillColor="black"
          unfillColor="#FFFFFF"
          isChecked={heabrewDetectionEnabled}
          text="Heabrew Live Detection"
          iconStyle={{borderColor: 'black'}}
          iconInnerStyle={{borderWidth: 2}}
          textStyle={styles.text}
          onPress={setHeabrewDetectionEnabled}
        />

        <BouncyCheckbox
          size={25}
          fillColor="black"
          unfillColor="#FFFFFF"
          text="Learning Sound Effects "
          iconStyle={{borderColor: 'black'}}
          iconInnerStyle={{borderWidth: 2}}
          textStyle={styles.text}
          onPress={setLearningSoundEffectsEnabled}
          isChecked={learningSoundEffectsEnabled}
          style={{marginTop: 20}}
        />
      </View>
    </AnimatedBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  text: {
    fontFamily: 'JosefinSans-Regular',
    fontSize: 25,
    color: 'black',
    textDecorationLine: 'none',
  },
});
export default SettingsPage;
