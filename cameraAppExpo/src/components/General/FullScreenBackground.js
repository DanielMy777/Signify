import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
const help = '../../../resources/images/blueBackground.jpg';

let backgronudSrc;
try {
  backgronudSrc = require(help);
} catch (e) {
  backgronudSrc = null;
}

const FullScreenBackground = ({
  source = backgronudSrc,
  resizeMode = 'cover',
  children,
}) => {
  return (
    <ImageBackground
      source={source}
      style={styles.container}
      resizeMode={resizeMode}>
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '0%',
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
  },
});

export default FullScreenBackground;
