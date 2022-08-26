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
  DetectionType,
} from '../../Detection/detection-constants';
import {DEFAULT_MODEL} from '../../Detection/default-model';
import {create_hands_style} from '../../Utils/styles-utils';
import {useDeviceOrientation} from '../../Utils/custom-hooks';
import Orientation from 'react-native-orientation-locker';
import {OrientationNames} from '../../Utils/OrentationNames';
import {VectorIconType} from '../General/Icons';
import FontName from '../General/FontName';
import {useForceRender} from '../../Utils/custom-hooks';
import Languages from '../../Utils/Languages';
import {en_he_sign_convertor} from '../../Detection/en-sign-he-convertor';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NetworkException} from '../../Network/httpClient';
let detectLetterLock = false;
let framesHandDidntMove = 0;
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
  hebrewLanguage = false,
  stableDetection = false,
  stableDetectionWords = false,
  onDetectionTypeSwitch,
}) => {
  const [cameraPermission, setCameraPermission] = useState(undefined);
  const [handRect, setHandsRect] = useState(UN_DETECTED_HANDS);
  const [hand2Rect, setHand2Rect] = useState(UN_DETECTED_HANDS);
  const frameNumber = useSharedValue(0);
  const [detectedChar, setDetectedChar] = useState('');
  const [errorText, setErrorText] = useState('');
  const detectType = useSharedValue(DetectionType.LETTER);
  const device_orientation = useDeviceOrientation();
  const reRender = useForceRender();
  const isHeabrew = useSharedValue(false);
  //console.log(device_orientation);

  useEffect(() => {
    detectLetterLock = false;
  }, []);

  useEffect(() => {
    isHeabrew.value = hebrewLanguage;
  }, [hebrewLanguage]);

  const getDetectedStyleByDetectionType = () => {
    return detectType.value == DetectionType.LETTER
      ? styles.DetectedLetterText
      : styles.DetectedWordText;
  };

  const updateResultsByLanguage = detect_res => {
    //console.log(detect_res.sign);
    detect_res.sign.language = Languages.ENGLISH;
    if (isHeabrew.value) {
      detect_res.sign.language = Languages.HEABREW;
      detect_res.sign.char = en_he_sign_convertor.convert(detect_res.sign);
    }

    if (detect_res.sign.char == 'DAL' && !isHeabrew.value) {
      detect_res.sign.char = 'D';
    }
    if (detect_res.sign.char == 'SP') detect_res.sign.char = ' ';
    if (
      (detect_res.sign.char == 'TZ' || detect_res.sign.char == 'CH') &&
      !isHeabrew.value
    ) {
      detect_res.sign.char = '!';
    }
  };

  const detectedTextStyle = useMemo(() => {
    return detectedChar != EMPTY_SIGN
      ? getDetectedStyleByDetectionType()
      : {...getDetectedStyleByDetectionType(), backgroundColor: 'orange'};
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

  hand1_style = useMemo(() => {
    return create_hands_style(
      fix_hands_rect(handRect),
      styles.hand_rect_default,
      HandRectStyle,
      device_orientation,
    );
  }, [handRect, device_orientation]);

  hand2_style = useMemo(() => {
    return create_hands_style(
      fix_hands_rect(hand2Rect),
      styles.hand_rect_default,
      HandRectStyle,
      device_orientation,
    );
  }, [hand2Rect, device_orientation]);

  useEffect(() => {
    check_premessions_interval = setInterval(() => {
      check_request_camera_premession(setCameraPermission);
    }, 1000);
    check_request_camera_premession(setCameraPermission);
    return () => {
      clearInterval(check_premessions_interval);
    };
  }, []);

  const getDetectTypeIcon = () => {
    return {
      name:
        detectType.value == DetectionType.LETTER
          ? 'format-letter-case'
          : 'file-word-box-outline',
      icon_type: VectorIconType.MatterialCommunity,
      color: 'black',
      onPress: () => {
        prev_value = detectType.value;
        new_value =
          detectType.value == DetectionType.LETTER
            ? DetectionType.WORD
            : DetectionType.LETTER;
        detectType.value = new_value;

        if (onDetectionTypeSwitch) onDetectionTypeSwitch(new_value);
        reRender();
      },
    };
  };

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
      const stableDetect =
        stableDetection ||
        (detectType.value == DetectionType.WORD && stableDetectionWords);
      const fnumber = updateGetFrameNumber();
      const middleFrame = Math.ceil(frameProcessorFps / 2);
      const detectSignMethod =
        (fnumber == 1 || (fnumber == frameProcessorFps && false)) &&
        detectSignFrames !== 0 &&
        (!stableDetect ||
          // detectLetterLock == false ?is it good no one know no one
          framesHandDidntMove >= Math.floor(frameProcessorFps / 2));
      //console.log(framesHandDidntMove);
      if (detectSignMethod) {
        //console.log('here')
        detectLetterLock = true;
        //console.log('getting lock');
      }

      //console.log(detectType.value);

      detect_method = detectSignMethod
        ? DetectModel.detectSignLanguageByDetectionType
        : DetectModel.detectHandsByDetectType;
      detect_res = await detect_method(img, detectType.value);
      const hands = detect_res.hands;
      //console.log(hands);
      //hands.hand1.stable = hands.hand2.stable = true;
      const hand_moves =
        hands.hand1.stable || hands.hand2.stable || detect_res.error;
      if (hands.hand1.stable) {
        setHandsRect(hands.hand1);
      }

      if (hands.hand2.stable) {
        setHand2Rect(hands.hand2);
      }

      if (!detectSignMethod) {
        framesHandDidntMove += 1;
        if (hand_moves) {
          framesHandDidntMove = 0;
        }
      }

      if (detectSignMethod) {
        // console.log(detect_res);
        detectLetterLock = false;
      }

      if (detect_res.error) {
        setDetectedChar('');
        setHandsRect(UN_DETECTED_HANDS);
        setHand2Rect(UN_DETECTED_HANDS);
        setErrorText(detect_res.error.to_string());
        if (onError) onError(detect_res.error);
        return;
      }
      setErrorText('');
      if (onDetection) onDetection(detect_res);
      if (onHandsDetection) onHandsDetection(detect_res);
      if (detectSignMethod) {
        updateResultsByLanguage(detect_res);
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
            rightMaterialIconsButtons={[getDetectTypeIcon()]}
          />
          {handRect.detected && <View style={hand1_style}></View>}
          {hand2Rect.detected && <View style={hand2_style} />}
          {detectedChar != '' && detectedChar != ' ' && (
            <Text style={detectedTextStyle}>{detectedChar}</Text>
          )}

          {detectedChar != '' && detectedChar == ' ' && (
            <View style={detectedTextStyle}>
              <MaterialCommunityIcons name="keyboard-space" size={30} />
            </View>
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
    borderColor: '#00ff7e', //#42df90
    position: 'absolute',
  },
  DetectedLetterText: {
    position: 'absolute',
    left: '4%',
    top: '5%',
    backgroundColor: 'green',
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    textAlign: 'center',
    alignItems: 'center',
    paddingTop: 1,
    fontSize: 30,
    backgroundColor: '#00ff7e',
    color: 'black',
  },
  DetectedWordText: {
    position: 'absolute',
    left: '4%',
    top: '5%',
    backgroundColor: 'green',
    height: 44,
    textAlign: 'center',
    alignItems: 'center',
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 10,
    fontSize: 30,
    backgroundColor: '#00ff7e',
    color: 'black',
  },
  errorText: {
    position: 'absolute',
    top: '85%',
    textAlign: 'center',
    width: '100%',
    fontSize: 30,
    color: 'black',
    backgroundColor: 'rgba(255, 190, 0,0.85)',
    borderRadius: 50,
    left: '5%',
    width: '90%',
    fontFamily: FontName.BerlinSans,
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
