import React, {useState, useRef, useCallback} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {EMPTY_SIGN} from '../../Detection/detection-constants';
import SignifyCamera from '../Camera/SignifyCamera';
import {count_char_sequence_from_str_end} from '../../Utils/utils';

const CameraPage = ({style, CharMaxSequence = 2}) => {
  const [predictedText, setPredictedText] = useState('');
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
      setPredictedText(prev =>
        count_char_sequence_from_str_end(prev, res.sign.char) <
        CharMaxSequence
          ? prev + res.sign.char
          : prev,
      );
    } else if (res.sign.char != EMPTY_SIGN) {
    }

    signToNotAllowInsertTwiceInARow.value =
      signToNotAllowInsertTwiceInARow.value != res.sign.char
        ? res.sign.char
        : EMPTY_SIGN;
  }, []);

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
      />
      <View style={styles.predictedTextView}>
        <Text style={styles.predictedTextTitle}>Predicted Text:</Text>
        <ScrollView
          contentContainerStyle={styles.prdeictedScrollView}
          ref={predictedTextScrollViewRef}
          onContentSizeChange={() =>
            predictedTextScrollViewRef.current.scrollToEnd({animated: true})
          }>
          <Text style={styles.predictedText}>{predictedText}</Text>
        </ScrollView>
      </View>
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
    height: '70%',
  },
  predictedText: {
    fontSize: 30,
  },
  prdeictedScrollView: {
    width: '100%',
    textAlign: 'center',
  },
  predictedTextView: {
    position: 'absolute',
    top: '75%',
    height: '24%',
    width: '100%',
    alignItems: 'center',
  },
  predictedTextTitle: {
    fontSize: 20,
  },
});

export default CameraPage;
