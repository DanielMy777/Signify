import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import React, {useState, useCallback, useRef, useMemo} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {PressableOpacity} from 'react-native-pressable-opacity';
import Tts from '../../Utils/text-to-speech';
import SignText from '../General/SignText';
import SignifyCamera from '../Camera/SignifyCamera';
import {useKeyBoardOpen} from '../../Utils/custom-hooks';
const LearningSignLanguagePage = () => {
  const [text, setText] = useState('');
  const [signText, setSignText] = useState('');
  const keyboardOpen = useKeyBoardOpen();
  const signTextRef = useRef();
  const signTranslateViewHeight = 44,
    signTranslateViewHeightWhenKeyboardOpen = signTranslateViewHeight + 25;

  const onSignDetection = useCallback(
    detect_obj => {
      if (!signTextRef.current) {
        return;
      }
      signTextRef.current.detect_letter(detect_obj.sign.char);
    },
    [signTextRef],
  );

  const onTranslateButtonPressed = () => {
    setSignText(text);
    Keyboard.dismiss();
    signTextRef.current.clear_detected_letters();
  };

  const onTextToSpeechPressed = () => {
    Tts.say(text);
  };

  const sign_translate_view_height_current = !keyboardOpen
    ? signTranslateViewHeight
    : signTranslateViewHeightWhenKeyboardOpen;
  const signTranslateViewStyleFixed = useMemo(
    () => ({
      ...styles.signTranslateView,
      height: sign_translate_view_height_current + '%',
    }),
    [keyboardOpen],
  );
  styles.camera_style.top = sign_translate_view_height_current + '%';
  styles.camera_style.height = 100 - signTranslateViewHeight + '%';

  return (
    <View style={styles.container}>
      <View style={styles.backgroundColor} />
      <View style={signTranslateViewStyleFixed}>
        <View style={styles.input}>
          <TextInput
            style={styles.textBox}
            value={text}
            onChangeText={setText}
            placeholder="sentence to translate"
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
            <MaterialCommunityIcons
              name="volume-high"
              color="black"
              size={50}
            />
          </PressableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.signTextScrollView}
          persistentScrollbar={true}>
          <SignText text={signText} ref={signTextRef} />
        </ScrollView>
      </View>
      {
        <SignifyCamera
          style={styles.camera_style}
          onSignDetection={onSignDetection}
          frameProcessorFps={5}
          detectSignFrames={1}
          frameQuality={80}
          frameMaxSize={700}
          errorStyle={{top: '82%'}}
        />
      }
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundColor: {
    position: 'absolute',
    width: '100%',
    height: '100%',
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
    top: '40%',
    height: '60%',
    //transform: [{rotate: '360deg'}],
  },
  signTranslateView: {
    textAlign: 'center',
    alignItems: 'center',
    position: 'relative',
    top: '2%',
    width: '100%',
    height: '40%',
  },
  signTextScrollView: {textAlign: 'center'},
});
export default LearningSignLanguagePage;
