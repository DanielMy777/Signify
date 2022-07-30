import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
//import {google_translator} from '../../Api/google-translate-default-api';
class EmptyTextConvertor {
  static translate(text) {
    return 'transalted: ' + text;
  }
}

const TextTranslator = ({
  translate_model = EmptyTextConvertor,
  autocorrect_model = EmptyTextConvertor,
  text,
  AutoCorrect = false,
  textStyle,
  style,
}) => {
  return (
    <View style={{...styles.container, ...style}}>
      <View style={[styles.textScrollView, styles.scrollViewBorder]}>
        <ScrollView persistentScrollbar={true}>
          <Text style={textStyle}>{text}</Text>
        </ScrollView>
      </View>
      <View style={[styles.translatedTextScrollView, styles.scrollViewBorder]}>
        <ScrollView persistentScrollbar={true}>
          <Text style={textStyle}>
            Still in Maintance Bitch Desigen will be improved
          </Text>
        </ScrollView>
        <Text>can put icon here</Text>
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
    height: '50%',
  },
  translatedTextScrollView: {
    position: 'absolute',
    top: '52%',
    width: '100%',
    height: '48%',
  },
  scrollViewBorder: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'black',
    width: '96%',
    left: '2%',
  },
});
export default TextTranslator;
