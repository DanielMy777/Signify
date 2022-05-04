import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FontName from '../General/FontName';
const SignText = ({
  text,
  fontSize = styles.signText.fontSize,
  color = styles.signText.color,
  detectedLettersNumber = 0,
}) => {
  const getLetterColor = (letter, index) => {
    return index < detectedLettersNumber ? 'green' : color;
  };
  let letter_index = 0; // only the indexes of chars that are not ' '
  return (
    <Text style={styles.signText}>
      {text.split('').map((letter, index) => {
        letter_color = getLetterColor(letter, letter_index);
        letter_index += letter != ' ';
        return (
          <Text style={{color: letter_color}} key={index}>
            {letter}
          </Text>
        );
      })}
    </Text>
  );
};

const styles = StyleSheet.create({
  signText: {
    fontSize: 120,
    fontFamily: FontName.AmericanSignLanguage,
    color: 'black',
  },
});

export default SignText;
