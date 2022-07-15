import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {PressableOpacity} from 'react-native-pressable-opacity';
import SignifyHeader from '../General/SignifyHeader';
import Tts from '../../Utils/text-to-speech';
import SignText from '../General/SignText';
import SignifyCamera from '../Camera/SignifyCamera';
import {useKeyBoardOpen} from '../../Utils/custom-hooks';
const LearningSignLanguagePage = () => {
  const [text, setText] = useState('');
  const [signText, setSignText] = useState('');
  const keyboardOpen = useKeyBoardOpen();
  const signTextRef = useRef();

  const onSignDetection = detect_obj => {
    if (!signTextRef.current) {
      return;
    }
    signTextRef.current.detect_letter(detect_obj.sign.char);
  };

  const onTranslateButtonPressed = () => {
    setSignText(text);
    signTextRef.current.clear_detected_letters();
  };

  const onTextToSpeechPressed = () => {
    Tts.say(text);
  };

  styles.camera_style.top = (!keyboardOpen ? 50 : 75) + '%';

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

        <PressableOpacity
          style={{marginLeft: 5}}
          disabledOpacity={0.4}
          onPress={onTextToSpeechPressed}>
          <MaterialCommunityIcons name="volume-high" color="black" size={50} />
        </PressableOpacity>
      </View>

      <ScrollView style={{marginBottom: 120}} persistentScrollbar={true}>
        <SignText text={signText} ref={signTextRef} />
      </ScrollView>
      {
        <SignifyCamera
          style={styles.camera_style}
          onSignDetection={onSignDetection}
          frameProcessorFps={5}
          detectSignFrames={1}
          frameQuality={80}
          frameMaxSize={700}
          errorStyle={{top: '85%', fontSize: 26}}
        />
      }
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
    alignItems: 'center',
    flex: 1,
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
  camera_style: {
    position: 'absolute',
    top: '50%',
    height: '50%',
    //transform: [{rotate: '360deg'}],
  },
});
export default LearningSignLanguagePage;
