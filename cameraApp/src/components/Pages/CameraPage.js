import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {StyleSheet, Text, View, Button, Dimensions, Image} from 'react-native';
import {EMPTY_SIGN} from '../../Detection/detection-constants';
import SignifyCamera from '../Camera/SignifyCamera';

const CameraPage = ({style}) => {
  const [errorText, setErrorText] = useState(undefined);
  const [predictedText, setPredictedText] = useState('');
  const onError = useCallback(error => {
    setErrorText(error.to_string());
  });
  const onDetection = useCallback(res => {
    setErrorText(undefined);
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
      {errorText != undefined && (
        <Text style={styles.errorText}>{errorText}</Text>
      )}
      <Text style={styles.predictedText}>{predictedText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorText: {
    position: 'absolute',
    top: '60%',
    textAlign: 'center',
    width: '100%',
    fontSize: 30,
    color: 'black',
    backgroundColor: 'red',
    left: '5%',
    width: '90%',
  },
  camera: {
    position: 'absolute',
    top: '0%',
    left: '0%',
    width: '100%',
    height: '70%',
  },
  predictedText: {
    position: 'absolute',
    top: '80%',
    width: '100%',
    fontSize: 30,
    textAlign: 'center',
    backgroundColor: 'red',
  },
});

export default CameraPage;
