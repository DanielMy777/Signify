import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {StyleSheet, Text, View, Button, Dimensions, Image} from 'react-native';
import Base64Camera from './Base64Camera';
import {check_request_camera_premession} from '../../AppPremessions/camera-premessions';
import {useSharedValue} from 'react-native-reanimated';
import PremessionsPage from '../Pages/PremessionsPage';
import {
  EMPTY_RESULTS,
  UN_DETECTED_HANDS,
} from '../../Detection/detection-constants';
import {DEFAULT_MODEL} from '../../Detection/default-model';
import {create_hands_style} from '../../Utils/styles-utils';
import {DetectException} from '../../Utils/custom-exceptions';

const SignifyCamera = ({
  style,
  HandRectStyle = styles.hand_rect_default,
  frameProcessorFps = 3,
  frameMaxSize = 250,
  frameQuality = 30,
  DetectModel = DEFAULT_MODEL,
  onDetection,
  detectSignFrames,
  onSignDetection,
  onError,
}) => {
  const [cameraPermission, setCameraPermission] = useState(undefined);
  const [handRect, setHandsRect] = useState(UN_DETECTED_HANDS);
  const frameNumber = useSharedValue(0);

  hands_style = useMemo(() => {
    return create_hands_style(
      handRect,
      styles.hand_rect_default,
      HandRectStyle,
    );
  }, [handRect]);

  useEffect(() => {
    check_premessions_interval = setInterval(() => {
      check_request_camera_premession(setCameraPermission);
    }, 1000);
    check_request_camera_premession(setCameraPermission);
    return () => {
      clearInterval(check_premessions_interval);
    };
  }, []);

  const updateGetFrameNumber = useCallback(() => {
    let value = frameNumber.value;
    value += 1;
    if (value >= frameProcessorFps) frameNumber.value = 0;
    else frameNumber.value += 1;
    return value;
  }, [frameProcessorFps]);

  const upload_img = useCallback(
    async img => {
      let detect_res = EMPTY_RESULTS;

      const fnumber = updateGetFrameNumber();
      const detectSignMethod =
        (fnumber == 1 || (fnumber == frameProcessorFps && false)) &&
        detectSignFrames !== 0;
      //console.log(detectSignMethod);
      detect_res = await (detectSignMethod
        ? DetectModel.detectSign(img)
        : DetectModel.detectHands(img));
      if (detect_res.hands.handsRect.stable) {
        detect_res.hands.detected = true;
        setHandsRect(detect_res.hands.handsRect);
      }

      if (detect_res.error) {
        onError(detect_res.error);
        return;
      }
      if (detectSignMethod) {
        if (onDetection) onDetection(detect_res);
        if (onSignDetection) onSignDetection(detect_res);
      }
    },
    [detectSignFrames, updateGetFrameNumber],
  );

  return (
    <View style={{...styles.container, ...style}}>
      {cameraPermission == false && <PremessionsPage />}
      {cameraPermission && (
        <View style={styles.container}>
          <Base64Camera
            handle_frame={upload_img}
            handsOk={handRect.detected}
            style={styles.camera}
            frameProcessorFps={frameProcessorFps}
            frameMaxSize={frameMaxSize}
            frameQuality={frameQuality}
          />
          {handRect.detected && <View style={hands_style}></View>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  hand_rect_default: {
    borderWidth: 4,
    borderColor: 'green',
    position: 'absolute',
  },
});

export default SignifyCamera;
