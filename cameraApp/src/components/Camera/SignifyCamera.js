import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {StyleSheet, Text, View, Button, Dimensions, Image} from 'react-native';
import {EMPTY_SIGN} from '../../Detection/detection-constants';
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
import {useDeviceOrientation} from '../../Utils/custom-hooks';
import Orientation from 'react-native-orientation-locker';
import {OrientationNames} from '../../Utils/OrentationNames';

const SignifyCamera = ({
  style,
  HandRectStyle = styles.hand_rect_default,
  frameProcessorFps = 3,
  frameMaxSize = 250,
  frameQuality = 30,
  DetectModel = DEFAULT_MODEL,
  onDetection,
  detectSignFrames = 1,
  onSignDetection,
  onHandsDetection,
  showErrors = true,
  errorStyle,
  onError,
}) => {
  const [cameraPermission, setCameraPermission] = useState(undefined);
  const [handRect, setHandsRect] = useState(UN_DETECTED_HANDS);
  const frameNumber = useSharedValue(0);
  const [detectedChar, setDetectedChar] = useState('');
  const [errorText, setErrorText] = useState('');
  const device_orientation = useDeviceOrientation();
  //console.log(device_orientation);

  const detectedTextStyle = useMemo(() => {
    return detectedChar != EMPTY_SIGN
      ? styles.DetectedText
      : {...styles.DetectedText, backgroundColor: 'orange'};
  }, [detectedChar]);

  const fix_hands_rect = hands_rect => {
    if (Orientation.isLocked()) {
      if (device_orientation == OrientationNames.LANDSCAPE_LEFT) {
        hands_rect = {
          x: 100 - hands_rect.y - hands_rect.h,
          y: hands_rect.x,
          w: hands_rect.h,
          h: hands_rect.w,
        };
      }

      if (device_orientation == OrientationNames.LANDSCAPE_RIGHT) {
        hands_rect = {
          x: hands_rect.y,
          y: 100 - hands_rect.x - hands_rect.w,
          w: hands_rect.h,
          h: hands_rect.w,
        };
      }
    }
    return hands_rect;
  };

  hands_style = useMemo(() => {
    return create_hands_style(
      fix_hands_rect(handRect),
      styles.hand_rect_default,
      HandRectStyle,
      device_orientation,
    );
  }, [handRect, device_orientation]);

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

      detect_res = await (detectSignMethod
        ? DetectModel.detectSign(img)
        : DetectModel.detectHands(img));
      if (detect_res.hands.handsRect.stable) {
        //update only when needs make it look smooth
        detect_res.hands.detected = true;
        setHandsRect(detect_res.hands.handsRect);
      }

      if (detect_res.error) {
        setDetectedChar('');
        setHandsRect(UN_DETECTED_HANDS);
        setErrorText(detect_res.error.to_string());
        if (onError) onError(detect_res.error);
        return;
      }
      setErrorText('');
      if (onDetection) onDetection(detect_res);
      if (onHandsDetection) onHandsDetection(detect_res);
      if (detectSignMethod) {
        if (onSignDetection) onSignDetection(detect_res);
        setDetectedChar(detect_res.sign.char);
      }
    },
    [detectSignFrames, updateGetFrameNumber],
  );

  const container_style =
    cameraPermission == true
      ? {...styles.container, ...style}
      : styles.fullScreen;

  return (
    <View style={container_style}>
      {cameraPermission == false && <PremessionsPage />}
      {cameraPermission && (
        <View style={styles.container}>
          <Base64Camera
            handle_frame={upload_img}
            handsOk={handRect.detected}
            frameProcessorFps={frameProcessorFps}
            frameMaxSize={frameMaxSize}
            frameQuality={frameQuality}
          />
          {handRect.detected && <View style={hands_style}></View>}
          {detectedChar != '' && (
            <Text style={detectedTextStyle}>{detectedChar}</Text>
          )}

          {showErrors && errorText.length > 0 && (
            <Text style={{...styles.errorText, ...errorStyle}}>
              {errorText}
            </Text>
          )}
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
  errorText: {
    position: 'absolute',
    top: '85%',
    textAlign: 'center',
    width: '100%',
    fontSize: 30,
    color: 'black',
    backgroundColor: 'red',
    left: '5%',
    width: '90%',
  },
  fullScreen: {
    position: 'absolute',
    top: '0%',
    height: '100%',
    width: '100%',
    zIndex: 10,
    flex: 1,
  },
});

export default SignifyCamera;
