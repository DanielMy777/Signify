import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';
import FullScreenBackground from '../General/FullScreenBackground';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import React, {useEffect, useState} from 'react';
import {request_camera_premession} from '../../AppPremessions/camera-premessions';
import SignifyHeader from '../General/SignifyHeader';
import {getPercent} from '../../Utils/utils';

const PremessionsPage = ({paddingTopPercent = 5}) => {
  const dimension = useWindowDimensions();
  console.log(getPercent(dimension.height, paddingTopPercent));
  return (
    <FullScreenBackground>
      <SignifyHeader fontSize={50} />
      <View
        style={{
          ...styles.container,
          marginTop: getPercent(dimension.height, paddingTopPercent),
        }}>
        <Text style={styles.text}>Camera Premession Needed</Text>
        <AwesomeButtonRick
          type="primary"
          onPress={request_camera_premession}
          backgroundColor="black"
          textColor="white"
          backgroundDarker={null}>
          Give Premession
        </AwesomeButtonRick>
      </View>
    </FullScreenBackground>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 65,
    fontFamily: 'BerkshireSwash-Regular',
    color: 'black',
    textAlign: 'center',
    marginBottom: '2%',
  },
  container: {
    alignItems: 'center',
    marginTop: '5%',
  },
});

export default PremessionsPage;
