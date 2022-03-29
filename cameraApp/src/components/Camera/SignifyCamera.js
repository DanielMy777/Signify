import React, {useState, useEffect, useMemo, useRef, useCallback} from 'react';
import {StyleSheet, Text, View, Button, Dimensions, Image} from 'react-native';
import Base64Camera from './Base64Camera';
import {check_request_camera_premession} from '../../AppPremessions/camera-premessions';
import PremessionsPage from '../Pages/PremessionsPage';
import {
  EMPTY_RESULTS,
  UN_DETECTED_HANDS,
} from '../../Detection/detection-constants';
import {DEFAULT_MODEL} from '../../Detection/default-model';
import {create_hands_style} from '../../Utils/styles-utils';

const SignifyCamera = ({
  style = styles.camera,
  HandRectStyle = styles.hand_rect_default,
  frameProcessorFps = 3,
  frameMaxSize = 250,
  frameQuality = 30,
  DetectModel = DEFAULT_MODEL,
  onDetection,
}) => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [handRect, setHandsRect] = useState(UN_DETECTED_HANDS);
  const camera_style = style;
  hands_style = useMemo(() => {
    return create_hands_style(
      handRect,
      styles.hand_rect_default,
      camera_style,
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

  const upload_img = useCallback(async img => {
    let detect_res;
    try {
      detect_res = await DetectModel.detectHandSign(img);
      if (detect_res.hands.handsRect.stable) {
        detect_res.hands.detected = true;
        setHandsRect(detect_res.hands.handsRect);
      }
    } catch (err) {
      console.log(err.to_string());
      setHandsRect(UN_DETECTED_HANDS);
      detect_res = EMPTY_RESULTS;
      detect_res.error = err.to_string();
    }

    if (onDetection) onDetection(detect_res);
  }, []);

  return (
    <View style={styles.container}>
      {!cameraPermission && <PremessionsPage />}
      {cameraPermission && (
        <View style={styles.container}>
          <Base64Camera
            handle_frame={upload_img}
            handsOk={handRect.detected}
            style={style}
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
  },
  camera: {
    position: 'absolute',
    top: '0%',
    left: '0%',
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
