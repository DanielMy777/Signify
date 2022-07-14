import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useImperativeHandle, useState} from 'react';
import FontName from '../General/FontName';
const SignText = (
  {
    text,
    fontSize = styles.signText.fontSize,
    color = styles.signText.color,
    detectedColor = 'green',
    onLetterDetected,
    onTextDetected,
  },
  ref,
) => {
  const [detectedLettersCount, setDetectedLettersCount] = useState(0);
  useEffect(() => {
    setDetectedLettersCount(0);
  }, [text]);

  useImperativeHandle(ref, () => {
    return {
      detect_letter: detect_letter,
      get_detected_letters_count: get_detected_letters_count,
      clear_detected_letters: () => {
        setDetectedLettersCount(0);
      },
    };
  });

  const detect_letter = letter => {
    letter = letter.toUpperCase();
    const text_no_spaces = [...text.toUpperCase()].filter(x => x != ' ');
    if (detectedLettersCount >= text.length) {
      return false;
    }

    console.log(
      `i_letter = ${letter} current_letter = ${text_no_spaces[detectedLettersCount]}`,
    );
    const detected_current_letter =
      text_no_spaces[detectedLettersCount] == letter;
    console.log(detected_current_letter);
    if (detected_current_letter) {
      setDetectedLettersCount(detectedLettersCount + 1);
      if (onLetterDetected) {
        onLetterDetected(
          letter,
          detectedLettersCount + 1,
          text.length - (detectedLettersCount + 1),
        );

        if (onTextDetected) {
          onTextDetected();
        }
      }
    }

    return detected_current_letter;
  };

  const get_detected_letters_count = () => {
    return detectedLettersCount;
  };

  const getLetterColor = (letter, index) => {
    return index < detectedLettersCount ? detectedColor : color;
  };
  let letter_index = 0; // only the indexes of chars that are not ' '
  return (
    <Text style={{...styles.signText, fontSize}}>
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

export default React.forwardRef(SignText);
