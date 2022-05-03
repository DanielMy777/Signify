import {View, Text, TextInput, ScrollView, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import FontName from '../General/FontName';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {PressableOpacity} from 'react-native-pressable-opacity';
import SignifyHeader from '../General/SignifyHeader';
const LearningSignLanguagePage = () => {
  const [text, setText] = useState('');
  const [signText, setSignText] = useState('');

  const onTranslateButtonPressed = () => {
    setSignText(text);
  };

  return (
    <View style={styles.container}>
      <SignifyHeader fontSize={50} />
      <View style={styles.input}>
        <TextInput
          style={styles.textBox}
          value={text}
          onChangeText={setText}
          placeholder="word to translate"
          onSubmitEditing={onTranslateButtonPressed}
        />
        <PressableOpacity
          style={styles.button}
          disabledOpacity={0.4}
          onPress={onTranslateButtonPressed}>
          <FontAwesome
            name="american-sign-language-interpreting"
            color="black"
            size={40}
          />
        </PressableOpacity>
      </View>
      <ScrollView style={{marginBottom: 120}}>
        <Text style={styles.signText}>{signText} </Text>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
    alignItems: 'center',
  },
  signText: {
    fontSize: 120,
    fontFamily: FontName.AmericanSignLanguage,
    color: 'green',
  },
  textBox: {
    borderWidth: 1,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
export default LearningSignLanguagePage;
