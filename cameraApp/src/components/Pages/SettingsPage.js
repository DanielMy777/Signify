import {View, StyleSheet, Alert} from 'react-native';
import React, {useState, useContext} from 'react';
import {AnimatedBackground} from '../General/AnimatedBackground';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import {AppContext} from '../../Context/AppContext';

const SettingsPage = () => {
  const {
    heabrewDetectionEnabled,
    setHeabrewDetectionEnabled,
    learningSoundEffectsEnabled,
    setLearningSoundEffectsEnabled,
    setSignWordsLearned,
  } = useContext(AppContext);

  const onDeleteProgressPress = () => {
    Alert.alert('Delete words progress', 'are you sure?', [
      {
        text: 'Yes',
        onPress: () => {
          setSignWordsLearned({});
        },
      },
      {
        text: 'No',
      },
    ]);
  };
  return (
    <AnimatedBackground animation={false}>
      <View style={styles.container}>
        <BouncyCheckbox
          size={25}
          fillColor="black"
          unfillColor="#FFFFFF"
          isChecked={heabrewDetectionEnabled}
          text="Hebrew Live Detection"
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
        <AwesomeButtonRick
          type="primary"
          style={styles.deleteProgressButton}
          onPress={onDeleteProgressPress}
          backgroundColor="#fcf003"
          textColor={'black'}
          textSize={30}
          stretch={true}
          backgroundDarker="#fcca03"
          backgroundShadow={null}
          //style={style}
        >
          Erase Progress
        </AwesomeButtonRick>
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
  deleteProgressButton: {
    width: '80%',
    top: 20,
  },
});
export default SettingsPage;
