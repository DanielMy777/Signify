import {
  View,
  Text,
  StyleSheet,
  Button,
  ImageBackground,
  Dimensions,
} from 'react-native';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick';
import React, {useEffect, useState} from 'react';
import {request_camera_premession} from '../../AppPremessions/camera-premessions';
import {getPercent} from '../../Utils/utils';
import SignifyHeader from '../General/SignifyHeader';
import {
  getWindowDimensions,
  addWindowSizeChangeListener,
} from '../../Utils/window-size';
const backgronudSrc = require('../../../resources/images/blueBackground.jpg');

const PremessionsPage = ({paddingTopPercent = 20}) => {
  const [dimensions, setDimensions] = useState(getWindowDimensions());
  useEffect(() => {
    const windowSizeChangeListner = addWindowSizeChangeListener(setDimensions);
    return () => {
      windowSizeChangeListner.remove();
    };
  }, []);
  console.log('height', dimensions.height);
  return (
    <ImageBackground
      style={{
        ...styles.container,
        paddingTop: getPercent(dimensions.height, paddingTopPercent),
        height: dimensions.height,
      }}
      source={backgronudSrc}>
      <SignifyHeader style={{position: 'absolute'}} fontSize={50} />
      <Text style={styles.text}>Camera Premession Needed</Text>
      <AwesomeButtonRick
        type="primary"
        onPress={request_camera_premession}
        backgroundColor="black"
        textColor="white"
        backgroundDarker={null}>
        Give Premession
      </AwesomeButtonRick>
    </ImageBackground>
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
    top: '0%',
    resizeMode: 'stretch',
    backgroundColor: 'red',
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
});

export default PremessionsPage;
