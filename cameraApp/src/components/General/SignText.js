import {StyleSheet, Text} from 'react-native';
import React from 'react';
import FontName from '../General/FontName';
const SignText = ({
  text,
  fontSize = styles.signText.fontSize,
  color = styles.signText.color,
}) => {
  return <Text style={{...styles.signText, fontSize, color}}>{text}</Text>;
};

const styles = StyleSheet.create({
  signText: {
    fontSize: 120,
    fontFamily: FontName.AmericanSignLanguage,
    color: 'green',
  },
});

export default SignText;
