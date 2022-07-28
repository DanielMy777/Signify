import React, {useState, useRef, useCallback} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {EMPTY_SIGN} from '../../Detection/detection-constants';
import SignifyCamera from '../Camera/SignifyCamera';
import {count_char_sequence_from_str_end} from '../../Utils/utils';
import FontName from '../General/FontName';
import {TextInput} from 'react-native-gesture-handler';

const CameraPage = ({style, CharMaxSequence = 2}) => {
  const [predictedText, setPredictedText] = useState(
    'hello how are you cat sadsadsadsadsa',
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
        return count_char_sequence_from_str_end(prev, res.sign.char) <
          CharMaxSequence
          ? prev + res.sign.char
          : prev;
      });
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
        <View style={{borderBottomWidth: 1, bottom: '15%'}}>
          <Text style={styles.predictedTextTitle}>Predicted Text:</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.prdeictedScrollView}
          ref={predictedTextScrollViewRef}
          onContentSizeChange={() =>
            predictedTextScrollViewRef.current.scrollToEnd({animated: true})
          }>
          <Text style={styles.predictedText}>
            {predictedText.toUpperCase()}
          </Text>
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
    marginTop: 5,
    fontSize: 30,
    fontFamily: FontName.Blocks,
    color: '#71797a',
  },
  prdeictedScrollView: {
    width: '100%',
  },
  predictedTextView: {
    position: 'absolute',
    top: '75%',
    height: '24%',
    width: '97%',
    left: '2%',
    right: '1%',
    alignItems: 'center',
  },
  predictedTextTitle: {
    fontSize: 23,
    fontFamily: FontName.BerlinSans,
    marginBottom: 10,
  },
});

export default CameraPage;
