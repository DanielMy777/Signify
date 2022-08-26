import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
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
import {
  is_english_text,
  is_heabrew_text,
  get_random_item_list,
} from '../../Utils/utils';
import {showWarning} from '../../Utils/pop-messages';
import {signWordsImages} from '../../Utils/signWordImages';
import {Dropdown} from 'react-native-element-dropdown';
import {DetectionType} from '../../Detection/detection-constants';
import {useSharedValue} from 'react-native-reanimated';
import {GeneralIcon, VectorIconType} from '../General/Icons';

let signTextHistory = '';
let detectedCharsHistory = 0;
let sentenceToTranslateHistory = '';
const wordsImagesData = signWordsImages.map((signWordImg, index) => ({
  word: signWordImg.word,
  index: index,
}));
const LearningSignLanguagePage = ({history = true}) => {
  const {signWordsLearned, setSignWordsLearned} = useContext(AppContext);
  const [wordsLearning, setWordsLearning] = useState(false);
  const wordsLearningSharedValue = useSharedValue(false);
  const [selectedWordIndex, setSelectedWordIndex] = useState(0);
  const selectedWordIndexSharedValue = useSharedValue(0);
  const [detectedWord, setDetectedWord] = useState(false);
  const [text, setText] = useState(history ? sentenceToTranslateHistory : '');
  const [signText, setSignText] = useState(history ? signTextHistory : '');
  const {learningSoundEffectsEnabled} = useContext(AppContext);
  const keyboardOpen = useKeyBoardOpen();
  const signTextRef = useRef(undefined);
  const signTranslateViewHeight = 44,
    signTranslateViewHeightWhenKeyboardOpen = signTranslateViewHeight + 25;
  useEffect(() => {
    if (history && signTextRef.current != undefined)
      signTextRef.current.setDetectedLettersCount(detectedCharsHistory);
  }, [signTextRef]);

  useEffect(() => {
    wordsLearningSharedValue.value = wordsLearning;
  }, [wordsLearning]);

  useEffect(() => {
    selectedWordIndexSharedValue.value = selectedWordIndex;
  }, [selectedWordIndex]);

  const selectRandomWord = () => {
    let word = get_random_item_list(wordsImagesData);
    while (word.index == selectedWordIndex && wordsImagesData.length > 1)
      word = get_random_item_list(wordsImagesData);

    setSelectedWordIndex(word.index);
    setDetectedWord(false);
  };

  const updateDetectedWordOnDetection = detect_obj => {
    setDetectedWord(detectedWordPrev => {
      if (
        !detectedWordPrev &&
        selectedWordIndexSharedValue.value >= 0 &&
        selectedWordIndexSharedValue.value < wordsImagesData.length &&
        detect_obj.sign.char ==
          wordsImagesData[selectedWordIndexSharedValue.value].word
      ) {
        //Tts.say(detect_obj.sign.char);
        play_random_sound();
        return true;
      }
      return detectedWordPrev;
    });
  };

  const updateLearnedWordsOnDetection = detect_obj => {
    setSignWordsLearned(words_learend => {
      const word = detect_obj.sign.char;
      if (words_learend[word] == true) return words_learend;
      let words_learned_updated = {...words_learend};
      words_learned_updated[word] = true;
      return words_learned_updated;
    });
  };

  const onSignDetection = useCallback(
    detect_obj => {
      if (wordsLearningSharedValue.value == false) {
        if (!signTextRef.current) {
          return;
        }
        signTextRef.current.detect_letter(detect_obj.sign.char);
      } else if (wordsLearningSharedValue.value == true) {
        updateDetectedWordOnDetection(detect_obj);
        updateLearnedWordsOnDetection(detect_obj);
      }
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
  //console.log(wordsImagesData);

  const get_current_word = () => {
    if (selectedWordIndex >= 0 && selectedWordIndex <= wordsImagesData.length) {
      return signWordsImages[selectedWordIndex].word;
    }
    return undefined;
  };

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.word}</Text>
        {signWordsLearned[item.word] == true && (
          <GeneralIcon
            style={styles.dropDownItemIcon}
            name="check-bold"
            size={18}
            color="green"
          />
        )}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.backgroundColor} />
      {wordsLearning && (
        <View style={signTranslateViewStyleFixed}>
          <View style={styles.input}>
            <Dropdown
              renderItem={renderItem}
              renderRightIcon={() => (
                <GeneralIcon
                  style={styles.dropDownItemIcon}
                  name="check-bold"
                  size={signWordsLearned[get_current_word()] == true ? 18 : 0}
                  color="green"
                />
              )}
              style={styles.dropdown}
              //searchQuery={(searchWord, wordLabel) => {
              // return wordLabel.startsWith(searchWord);
              //}}
              // containerStyle={styles.selectContainerStyle}
              placeholderStyle={styles.placeholderStyle}
              search
              inputSearchStyle={styles.inputSearchStyle}
              selectedTextStyle={styles.selectedTextStyle}
              value={selectedWordIndex}
              data={wordsImagesData}
              valueField="index"
              labelField="word"
              autoScroll={false}
              placeholder="Word"
              searchPlaceholder="Search..."
              onChange={data_obj => {
                if (data_obj.index == undefined) {
                  console.log('problem with index in DropDown learning page');
                  return;
                }
                setSelectedWordIndex(data_obj.index);
                setDetectedWord(false);
              }}
            />

            <PressableOpacity onPress={selectRandomWord}>
              <GeneralIcon
                size={30}
                Type={VectorIconType.FontAwesome}
                name="random"
                color="black"
              />
            </PressableOpacity>
          </View>

          {selectedWordIndex >= 0 &&
            selectedWordIndex <= signWordsImages.length && (
              <Image
                source={signWordsImages[selectedWordIndex].img}
                style={{
                  zIndex: 10000,
                  // position: 'absolute',
                  // top: '8%',
                  //left: '25%',
                  width: '70%',
                  height: '70%',
                  bottom: 20,
                }}
              />
            )}
          {selectedWordIndex >= 0 &&
            selectedWordIndex <= signWordsImages.length && (
              <Text
                style={{
                  fontSize: 35,
                  bottom: 15,
                  color: detectedWord ? 'white' : 'black',
                  paddingRight: 4,
                  paddingLeft: 4,
                  backgroundColor: detectedWord ? 'green' : 'transparent',
                }}>
                {signWordsImages[selectedWordIndex].word}
              </Text>
            )}
        </View>
      )}
      {!wordsLearning && (
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
      )}
      {
        <SignifyCamera
          style={styles.camera_style}
          onSignDetection={onSignDetection}
          frameProcessorFps={5}
          detectSignFrames={1}
          frameQuality={80}
          frameMaxSize={700}
          errorStyle={{top: '82%'}}
          onDetectionTypeSwitch={new_type => {
            setWordsLearning(new_type == DetectionType.WORD);
          }}
          hebrewLanguage={
            (!wordsLearning && !is_english_text(signText)) ||
            (wordsLearning && !is_english_text(get_current_word()))
          }
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
  dropdown: {
    margin: 16,
    height: 35,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    width: '50%',

    elevation: 2,
  },
  selectContainerStyle: {
    position: 'absolute',
    top: '100%',
    width: '100%',
  },
  placeholderStyle: {
    fontSize: 25,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 25,
    color: 'black',
  },
  inputSearchStyle: {
    fontSize: 20,
    color: 'black',
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  dropDownItemIcon: {
    marginRight: 5,
  },
});
export default LearningSignLanguagePage;
