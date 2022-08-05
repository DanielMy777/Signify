import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {google_translator} from '../../Api/google-translate-default-api';
import {Dropdown} from 'react-native-element-dropdown';
import {PressableOpacity} from 'react-native-pressable-opacity';
import {hideMessage, showError} from '../../Utils/pop-messages';

const local_data = [
  {
    value: 'EN',
    lable: 'English',
  },
  {
    value: 'FR',
    lable: 'French',
  },
  {
    value: 'HE',
    lable: 'Heabrew',
  },
];

class EmptyTextConvertor {
  static translate(text) {
    return 'transalted: ' + text;
  }
}

let translated_words_cache = {EN: {}, FR: {}, HE: {}};

const TextTranslator = ({
  translate_model = google_translator,
  text,
  AutoCorrect = false,
  textStyle,
  style,
}) => {
  const window_size = useWindowDimensions();
  const [language, setLanguage] = useState('EN');
  const [translatedText, setTranslatedText] = useState('');

  useEffect(() => {
    return () => {
      hideMessage();
    };
  }, []);

  styles.selectContainerStyle.width = window_size.width - 20;
  styles.selectContainerStyle.left = 10;

  const onTranslateButtonPressed = async () => {
    if (!text || text.length == 0) return;
    try {
      const cache_translate = translated_words_cache[language][text];
      if (cache_translate) {
        setTranslatedText(cache_translate);
        return;
      }
      translate_obj = await translate_model.translate(text, language);
      if (translate_obj.error) {
        showError(translate_obj.error.msg);
      } else {
        setTranslatedText(translate_obj.translated_text);
        translated_words_cache[language][text] = translate_obj.translated_text;
      }
    } catch (err) {
      showError(err.msg);
    }
  };

  return (
    <View style={{...styles.container, ...style}}>
      <View style={styles.controlPanel}>
        <Dropdown
          style={styles.dropdown}
          containerStyle={styles.selectContainerStyle}
          maxHeight={150}
          value={language}
          data={local_data}
          valueField="value"
          labelField="lable"
          autoScroll={false}
          placeholder="Language"
          searchPlaceholder="Search..."
          onChange={e => {
            setLanguage(e.value);
          }}
        />
        <PressableOpacity
          style={styles.button}
          onPress={onTranslateButtonPressed}>
          <Text style={{color: 'white', zIndex: 2000}}>Translate</Text>
        </PressableOpacity>
      </View>
      <View style={[styles.textScrollView, styles.scrollViewBorder]}>
        <ScrollView persistentScrollbar={true}>
          <Text style={textStyle}>{text}</Text>
        </ScrollView>
      </View>
      <View style={[styles.translatedTextScrollView, styles.scrollViewBorder]}>
        <ScrollView persistentScrollbar={true}>
          <Text style={textStyle}>{translatedText}</Text>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  textScrollView: {
    position: 'absolute',
    top: '15%',
    height: '45%',
  },
  translatedTextScrollView: {
    position: 'absolute',
    top: '62%',
    width: '100%',
    height: '38%',
  },
  scrollViewBorder: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'black',
    width: '96%',
    left: '2%',
  },
  dropdown: {
    width: '30%',
    zIndex: 1000,
  },
  controlPanel: {
    left: '3%',
    height: '14%',
    width: '98%',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  selectContainerStyle: {
    position: 'absolute',
    top: '100%',
    width: '100%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    left: 5,
  },
});
export default TextTranslator;
