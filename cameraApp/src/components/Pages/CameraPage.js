import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {StyleSheet, Text, View, Button, Dimensions, Image} from 'react-native';
import {EMPTY_SIGN} from '../../Detection/detection-constants';
import SignifyCamera from '../Camera/SignifyCamera';

const CameraPage = ({style}) => {
  const [predictedText, setPredictedText] = useState('');
  const onError = useCallback(error => {});
  const onDetection = useCallback(res => {
    if (res.sign && res.sign.char != EMPTY_SIGN) {
      setPredictedText(prev => prev + res.sign.char);
    }
  }, []);

  return (
    <View style={{...styles.container, ...style}}>
      <SignifyCamera
        onDetection={onDetection}
        style={styles.camera}
        frameProcessorFps={6}
        frameMaxSize={400}
        frameQuality={30}
        detectSignFrames={1}
        onError={onError}
      />
      <View style={styles.predictedTextView}>
        <Text style={styles.predictedTextTitle}>Predicted Text:</Text>
        <Text style={styles.predictedText}>{predictedText}</Text>
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
  predictedTextView: {
    position: 'absolute',
    top: '75%',
    alignItems: 'center',
    width: '100%',
  },
  predictedTextTitle: {
    fontSize: 20,
  },
});

export default CameraPage;
