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
      is_all_detected: () => {
        return (
          detectedLettersCount ==
          [...text].filter(x => x != ' ' && x != '\n').length
        );
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
        if (
          onTextDetected &&
          detectedLettersCount + 1 == text_no_spaces.length
        ) {
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

  const fix_english = english_text => {
    const words = english_text.split(' ');
    let fixed = '';
    for (word of words) {
      if (fixed != '') fixed += '\n';
      fixed += word;
    }
    return fixed;
  };

  const text_fixed = useMemo(() => {
    return isHeabrew ? convert_he_en(text) : text;
  }, [text, isHeabrew]);

  const getLetterColor = (letter, index) => {
    index = isHeabrew ? heabrewIndexes[index] : index;
    return index < detectedLettersCount ? detectedColor : color;
  };
  const textStyle = useMemo(() => {
    let signTextStyle = isHeabrew
      ? {...styles.signTextHeabrew}
      : {...styles.signText};
    if (fontSize) {
      signTextStyle.fontSize = fontSize;
    }
    signTextStyle.lineHeight = signTextStyle.fontSize;
    return signTextStyle;
  }, [isHeabrew, fontSize]);
  const fix_letter = letter => {
    if (isHeabrew) return letter;
    else {
      return letter.toLowerCase() == 'a' ? 'a' : letter.toUpperCase();
    }
  };
  if (
    text_fixed.length > 0 &&
    is_heabrew_text(text_fixed[0]) &&
    text_fixed[0] != ' '
  ) {
    return <View></View>;
  }
  return (
    <Text style={textStyle} adjustsFontSizeToFit={true}>
      {text_fixed.split('').map((letter, index) => {
        letter_color = getLetterColor(letter, letter_index);
        letter_index += letter != ' ' && letter != '\n';
        return (
          <Text style={{color: letter_color}} key={index}>
            {fix_letter(letter)}
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
