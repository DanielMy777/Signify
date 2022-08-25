import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useContext,
  useEffect,
} from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {PressableOpacity} from 'react-native-pressable-opacity';
import Tts from '../../Utils/text-to-speech';
import SignText from '../General/SignText';
import SignifyCamera from '../Camera/SignifyCamera';
import {useKeyBoardOpen} from '../../Utils/custom-hooks';
import {play_random_sound} from '../../Utils/sound';
import {AppContext} from '../../Context/AppContext';
import {is_english_text, is_heabrew_text} from '../../Utils/utils';
import {showWarning} from '../../Utils/pop-messages';
import {useSharedValue} from 'react-native-reanimated';

let signTextHistory = '';
let detectedCharsHistory = 0;
let sentenceToTranslateHistory = '';
const LearningSignLanguagePage = ({history = true}) => {
  const [text, setText] = useState(history ? sentenceToTranslateHistory : '');
  const [signText, setSignText] = useState(history ? signTextHistory : '');
  const {learningSoundEffectsEnabled} = useContext(AppContext);
  const keyboardOpen = useKeyBoardOpen();
  const signTextRef = useRef();
  const signTranslateViewHeight = 44,
    signTranslateViewHeightWhenKeyboardOpen = signTranslateViewHeight + 25;
  useEffect(() => {
    if (history)
      signTextRef.current.setDetectedLettersCount(detectedCharsHistory);
  }, [signTextRef]);

  const onSignDetection = useCallback(
    detect_obj => {
      if (!signTextRef.current) {
        return;
      }
      signTextRef.current.detect_letter(detect_obj.sign.char);
    },
    [signTextRef],
  );

  const onLetterDetected = () => {
    if (learningSoundEffectsEnabled) play_random_sound();
    detectedCharsHistory += 1;
  };

  const onTranslateButtonPressed = () => {
    if (!is_english_text(text) && !is_heabrew_text(text)) {
      showWarning('text must be english or heabrew no mixing', 1000);
      return;
    }
    setSignText(text);
    signTextHistory = text;
    detectedCharsHistory = 0;
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
  styles.camera_style.top = sign_translate_view_height_current + 3 + '%';
  styles.camera_style.height = 97 - signTranslateViewHeight + '%';
  const setTextFixed = text => {
    setText(text);
    sentenceToTranslateHistory = text;
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundColor} />
      <View style={signTranslateViewStyleFixed}>
        <View style={styles.input}>
          <TextInput
            style={styles.textBox}
            value={text}
            onChangeText={setTextFixed}
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
          //style={{width: '100%'}}
          persistentScrollbar={true}>
          <SignText
            text={signText}
            ref={signTextRef}
            onLetterDetected={onLetterDetected}
          />
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
          hebrewLanguage={is_heabrew_text(signText)}
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
  signTextScrollView: {
    textAlign: 'center',
    //alignItems:'center'
    paddingRight: 5,
  },
});
export default LearningSignLanguagePage;
