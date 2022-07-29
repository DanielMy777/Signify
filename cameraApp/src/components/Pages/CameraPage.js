import React, {useState, useRef, useCallback, useMemo} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {EMPTY_SIGN} from '../../Detection/detection-constants';
import SignifyCamera from '../Camera/SignifyCamera';
import {
  count_char_sequence_from_str_end,
  get_str_last_char,
} from '../../Utils/utils';
import FontName from '../General/FontName';
import IconButtonsContainer from '../General/IconButtonsContainer';
import Tts from '../../Utils/text-to-speech';

const CameraPage = ({style, CharMaxSequence = 2}) => {
  const [predictedText, setPredictedText] = useState(
    'abye how are you my dear  dear cathope you doing well ab',
  );

  const predictedTextScrollViewRef = useRef();
  const signToNotAllowInsertTwiceInARow = useSharedValue(EMPTY_SIGN);
  const onError = useCallback(error => {
    signToNotAllowInsertTwiceInARow.value = EMPTY_SIGN;
  }, []);

  const onSignDetection = useCallback(res => {
    if (
      res.sign.char != EMPTY_SIGN &&
      signToNotAllowInsertTwiceInARow.value != res.sign.char
    ) {
      setPredictedText(prev => {
        const add_new_char =
          count_char_sequence_from_str_end(prev, res.sign.char) <
            CharMaxSequence &&
          !(res.sign.char == ' ' && get_str_last_char(prev) == ' ');
        return add_new_char ? prev + res.sign.char : prev;
      });
    }

    signToNotAllowInsertTwiceInARow.value =
      signToNotAllowInsertTwiceInARow.value != res.sign.char
        ? res.sign.char
        : EMPTY_SIGN;
  }, []);

  const create_button_obj = (name, onPress = undefined) => {
    return {name, onPress};
  };

  const buttons = useMemo(
    () => [
      create_button_obj('delete', () => {
        setPredictedText('');
      }),
      create_button_obj('volume-high', () => {
        Tts.say(predictedText);
      }),
      create_button_obj('google-translate', () => {
        setPredictedText(prev => prev + 'A');
      }),
    ],
    [predictedText],
  );

  return (
    <View style={{...styles.container, ...style}}>
      <SignifyCamera
        onSignDetection={onSignDetection}
        style={styles.camera}
        frameProcessorFps={5}
        frameMaxSize={700}
        frameQuality={80}
        detectSignFrames={1}
        onError={onError}
        errorStyle={{fontSize: 28, top: '88%'}}
      />
      <View style={styles.predictedTextView}>
        <View style={styles.predictedTextTitleView}>
          <Text style={styles.predictedTextTitle}>Predicted Text:</Text>
        </View>
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
    fontSize: 25,
    fontFamily: FontName.Blocks,
    color: '#71797a',
  },
  prdeictedScrollView: {
    width: '100%',
    alignItems: 'center',
  },
  predictedTextView: {
    top: '64%',
    height: '29%',
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
    top: '95%',
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
