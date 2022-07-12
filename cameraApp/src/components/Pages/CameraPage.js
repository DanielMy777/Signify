import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {StyleSheet, Text, View, Button, Dimensions, Image} from 'react-native';
import {EMPTY_SIGN} from '../../Detection/detection-constants';
import {NetworkException} from '../../Network/httpClient';
import {HandsError} from '../../Utils/custom-exceptions';
import SignifyCamera from '../Camera/SignifyCamera';

const CameraPage = ({style}) => {
  const [errorText, setErrorText] = useState(undefined);
  const [detectedChar, setDetectedChar] = useState(null);
  const onError = useCallback(error => {
    setErrorText(error.to_string());
  });
  const onDetection = useCallback(res => {
    setErrorText(undefined);
    setDetectedChar(res.sign.char);
  }, []);
  const detectedTextStyle = useMemo(() => {
    return detectedChar != EMPTY_SIGN
      ? styles.DetectedText
      : {...styles.DetectedText, backgroundColor: 'orange'};
  }, [detectedChar]);

  return (
    <View style={{...styles.container, ...style}}>
      <SignifyCamera
        onDetection={onDetection}
        style={styles.camera}
        frameProcessorFps={8}
        frameMaxSize={400}
        frameQuality={30}
        detectSignFrames={1}
        onError={onError}
      />
      {errorText != undefined && <Text style={styles.myText}>{errorText}</Text>}
      {!errorText && detectedChar && (
        <Text style={detectedTextStyle}>{detectedChar}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  DetectedText: {
    position: 'absolute',
    left: '4%',
    top: '5%',
    backgroundColor: 'green',
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    textAlign: 'center',
    paddingTop: 3,
    fontSize: 30,
    color: 'black',
  },
  myText: {
    position: 'absolute',
    bottom: '5%',
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
    left: '10%',
    width: '80%',
    height: '80%',
  },
});

export default CameraPage;
