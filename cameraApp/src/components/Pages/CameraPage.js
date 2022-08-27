import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {DetectionType, EMPTY_SIGN} from '../../Detection/detection-constants';
import SignifyCamera from '../Camera/SignifyCamera';
import {
  count_char_sequence_from_str_end,
  get_str_last_char,
  get_last_word,
} from '../../Utils/utils';
import FontName from '../General/FontName';
import IconButtonsContainer from '../General/IconButtonsContainer';
import Tts from '../../Utils/text-to-speech';
import TextTranslator from '../General/TextTranslator';
import {useForceRender} from '../../Utils/custom-hooks';
import {play_random_sound} from '../../Utils/sound';
import {VectorIconType} from '../General/Icons';
import {correct_sentence} from '../../Utils/correct-sentence';
import {AppContext} from '../../Context/AppContext';
import Languages from '../../Utils/Languages';
let autoCorrectHistory = false;
let detectSoundHistory = true;
let predictedTextHistory = '';
let is_heabrew = false;
let selfiCameraHistory = true;
let detectTypeHistory = DetectionType.LETTER;
let cantSayWord = {};
const CameraPage = ({
  style,
  CharMaxSequence = 2,
  history = true,
  timeoutBetweenSayingSameWord = 1500,
}) => {
  const {heabrewDetectionEnabled} = useContext(AppContext);
  const [predictedText, setPredictedText] = useState('my name is o');
  const [googleTranslateEnabled, setGoogleTranslateEnabled] = useState(false);
  const detectSoundEnabled = useSharedValue(detectSoundHistory);
  const autoCorrectEnabled = useSharedValue(autoCorrectHistory);
  const forceRender = useForceRender();

  const predictedTextScrollViewRef = useRef();
  const signToNotAllowInsertTwiceInARow = useSharedValue(EMPTY_SIGN);

  useEffect(() => {
    predictedTextHistory = predictedText;
  }, [predictedText]);

  useEffect(() => {
    if (heabrewDetectionEnabled) {
      autoCorrectEnabled.value = false;
    }
    if (heabrewDetectionEnabled != is_heabrew) {
      setPredictedText('');
    }
    is_heabrew = heabrewDetectionEnabled;
  }, [heabrewDetectionEnabled]);
  const onError = useCallback(error => {
    signToNotAllowInsertTwiceInARow.value = EMPTY_SIGN;
  }, []);

  const setDetectSound = val => {
    detectSoundEnabled.value = val;
    detectSoundHistory = val;
  };

  const setAutoCorrect = val => {
    autoCorrectEnabled.value = val;
    autoCorrectHistory = val;
  };

  const sayTextIfEnabled = (text, is_word) => {
    if (
      detectSoundEnabled.value &&
      text != signToNotAllowInsertTwiceInARow.value &&
      cantSayWord[text] != true
    ) {
      if (text != ' ') {
        Tts.say(text);
        if (is_word) {
          cantSayWord[text] = true;
          setTimeout(() => {
            cantSayWord[text] = false;
          }, timeoutBetweenSayingSameWord);
        }
      } else {
        play_random_sound();
      }
    }
  };

  const is_to_add_text = (prev, res) => {
    const is_word = res.sign.is_word;
    const add_new_text =
      (!is_word &&
        count_char_sequence_from_str_end(prev, res.sign.char) <
          CharMaxSequence &&
        !(res.sign.char == ' ' && get_str_last_char(prev) == ' ')) ||
      (is_word && get_last_word(prev) != res.sign.char);
    return add_new_text;
  };

  const onSignDetection = useCallback(res => {
    is_word = res.sign.is_word;
    if (
      res.sign.char != EMPTY_SIGN &&
      signToNotAllowInsertTwiceInARow.value != res.sign.char
    ) {
      setPredictedText(prev => {
        const add_new_text = is_to_add_text(prev, res);

        sayTextIfEnabled(res.sign.char, is_word);
        add_if_word =
          is_word && prev != '' && get_str_last_char(prev) != ' ' ? ' ' : '';

        if (
          add_new_text &&
          !is_word &&
          autoCorrectEnabled.value &&
          prev.length > 0 &&
          get_str_last_char(prev) !== ' ' &&
          res.sign.char === ' '
        ) {
          const PRINT_MATCHES = true;
          return correct_sentence(prev, 3, !PRINT_MATCHES) + ' ';
        }
        return add_new_text ? prev + add_if_word + res.sign.char : prev;
      });
    }

    signToNotAllowInsertTwiceInARow.value =
      signToNotAllowInsertTwiceInARow.value != res.sign.char
        ? res.sign.char
        : EMPTY_SIGN;
  }, []);

  const create_button_obj = (name, onPress = undefined, color) => {
    return {name, onPress, color};
  };
  const buttons = useMemo(
    () => [
      create_button_obj('delete', () => {
        setPredictedText('');
      }),
      create_button_obj(
        detectSoundEnabled.value ? 'volume-high' : 'volume-mute',
        () => {
          setDetectSound(!detectSoundEnabled.value);
          forceRender();
        },
      ),
      {
        ...create_button_obj(
          autoCorrectEnabled.value && !heabrewDetectionEnabled
            ? 'auto-fix-normal'
            : 'auto-fix-off',
          () => {
            setAutoCorrect(!autoCorrectEnabled.value);
            forceRender();
          },
        ),
        type: VectorIconType.MaterialIcons,
        disabled: heabrewDetectionEnabled,
      },
      create_button_obj(
        'google-translate',
        () => {
          setGoogleTranslateEnabled(!googleTranslateEnabled);
        },
        googleTranslateEnabled ? 'black' : 'red',
      ),
    ],
    [
      predictedText,
      googleTranslateEnabled,
      detectSoundEnabled.value,
      autoCorrectEnabled.value,
      heabrewDetectionEnabled,
    ],
  );

  return (
    <View style={{...styles.container, ...style}}>
      <SignifyCamera
        onSignDetection={onSignDetection}
        style={styles.camera}
        frameProcessorFps={5}
        frameMaxSize={700}
        frameQuality={50}
        detectSignFrames={1}
        hebrewLanguage={heabrewDetectionEnabled}
        detectTypeDefault={detectTypeHistory}
        onDetectionTypeSwitch={new_type => {
          detectTypeHistory = new_type;
        }}
        // onError={onError}
        errorStyle={{fontSize: 28, top: '88%'}}
        stableDetection={false}
        stableDetectionWords={true}
        selfieCamera={selfiCameraHistory}
        onCameraViewChanged={isSelfie => {
          selfiCameraHistory = isSelfie;
        }}
      />
      <View style={styles.predictedTextView}>
        <View style={styles.predictedTextTitleView}>
          <Text style={styles.predictedTextTitle}>Predicted Text:</Text>
        </View>
        {!googleTranslateEnabled && (
          <ScrollView
            contentContainerStyle={styles.prdeictedScrollView}
            ref={predictedTextScrollViewRef}
            persistentScrollbar={true}
            style={{width: '100%'}}
            onContentSizeChange={() => {
              predictedTextScrollViewRef.current.scrollToEnd({animated: true});
            }}>
            <Text style={styles.predictedText}>
              {predictedText.toUpperCase()}
            </Text>
          </ScrollView>
        )}
        {googleTranslateEnabled && (
          <TextTranslator
            text={predictedText.toUpperCase()}
            style={{height: '94%', top: '-6%'}}
            textStyle={[{fontSize: 20}]}
          />
        )}
      </View>
      <IconButtonsContainer
        Buttons={buttons}
        style={styles.bottomButtons}
        IconSize={35}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    position: 'absolute',
    top: '0%',
    left: '0%',
    width: '100%',
    height: '60%',
  },
  predictedText: {
    marginTop: 5,
    fontSize: 30,
    color: '#71797a',
  },
  prdeictedScrollView: {
    width: '100%',
    alignItems: 'center',
  },
  predictedTextView: {
    top: '64%',
    height: '28%',
    width: '97%',
    left: '2%',
    right: '1%',
    alignItems: 'center',
  },
  predictedTextTitleView: {
    borderBottomWidth: 1,
    bottom: '10%',
  },
  predictedTextTitle: {
    fontSize: 23,
    fontFamily: FontName.BerlinSans,
  },
  bottomButtons: {
    position: 'absolute',
    top: '94%',
    width: '96%',
    backgroundColor: '#efefef',
    height: '5%',
    left: '2%',
    right: '2%',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
});

export default CameraPage;
