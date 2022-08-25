import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useImperativeHandle, useState, useMemo} from 'react';
import FontName from '../General/FontName';
import {is_heabrew_text, to_heabrew_lower_case} from '../../Utils/utils';
import {convert_he_en} from '../../Detection/en-sign-he-convertor';
const SignText = (
  {
    text,
    fontSize = undefined,
    color = styles.signText.color,
    detectedColor = 'green',
    onLetterDetected,
    onTextDetected,
  },
  ref,
) => {
  const [detectedLettersCount, setDetectedLettersCount] = useState(0);
  const [isHeabrew, setIsHeabrew] = useState(false);
  const [heabrewIndexes, setHeabrewIndexes] = useState([]);
  useEffect(() => {
    setDetectedLettersCount(0);
    const heabrew = is_heabrew_text(text);
    setIsHeabrew(heabrew);

    if (heabrew) {
      const words = text.split(' ');
      let words_lengts = 0;
      let heb_indexes = [];
      for (word of words) {
        // console.log(`word length = ${word.length}`);
        for (let i = 0; i < word.length; i++) {
          heb_indexes.push(words_lengts + word.length - 1 - i);
        }
        words_lengts += word.length;
      }
      setHeabrewIndexes(heb_indexes);
    }
  }, [text]);

  useImperativeHandle(ref, () => {
    return {
      detect_letter: detect_letter,
      get_detected_letters_count: get_detected_letters_count,
      setDetectedLettersCount: setDetectedLettersCount,
      clear_detected_letters: () => {
        setDetectedLettersCount(0);
      },
    };
  });

  const detect_letter = letter => {
    letter = letter.toUpperCase();
    const text_no_spaces = [...text.toUpperCase()].filter(
      x => x != ' ' && x != '\n',
    );
    if (detectedLettersCount >= text.length) {
      return false;
    }
    let current_letter = text_no_spaces[detectedLettersCount];
    current_letter = isHeabrew
      ? to_heabrew_lower_case(current_letter)
      : current_letter;

    const detected_current_letter = current_letter == letter;

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

  let letter_index = 0; // only the indexes of chars that are not ' '

  const text_fixed = useMemo(() => {
    return isHeabrew ? convert_he_en(text) : text;
  }, [text, isHeabrew]);

  const getLetterColor = (letter, index) => {
    index = isHeabrew ? heabrewIndexes[index] : index;
    return index < detectedLettersCount ? detectedColor : color;
  };
  const textStyle = useMemo(() => {
    const signTextStyle = isHeabrew ? styles.signTextHeabrew : styles.signText;
    if (fontSize) {
      return {...signTextStyle, fontSize};
    }
    return signTextStyle;
  }, [isHeabrew, fontSize]);

  return (
    <Text style={textStyle} adjustsFontSizeToFit={true}>
      {text_fixed.split('').map((letter, index) => {
        letter_color = getLetterColor(letter, letter_index);
        letter_index += letter != ' ' && letter != '\n';
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
    fontSize: 100,
    fontFamily: FontName.EnglishSignLanguage,
    color: 'black',
  },
  signTextHeabrew: {
    fontSize: 95,
    fontFamily: FontName.HeabrewSignLanguage,
    color: 'black',
    textAlign: 'right',
  },
});

export default React.forwardRef(SignText);
