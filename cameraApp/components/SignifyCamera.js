import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Image } from 'react-native';
import Base64Camera from './Base64Camera';
import { check_request_camera_premession } from '../src/premessions'
import { detect_hands, UN_DETECTED_HANDS } from '../src/detectionModel'
import {getNumInStr} from '../src/utils'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
function create_hands_style(hand_rect,camera_style) {

   const handRect = {...hand_rect};
   const left = getNumInStr(camera_style.left);
   const top = getNumInStr(camera_style.top);
   const c_width = getNumInStr(camera_style.width) / 100;
   const c_height = getNumInStr(camera_style.height) / 100 ;
   handRect.x = left + handRect.x * c_width ;
   handRect.y = top + handRect.y * c_height;
   handRect.w = handRect.w * c_width;
   handRect.h = handRect.h * c_height;


   styles.hand_rect.width = handRect.w + '%';
   styles.hand_rect.height = handRect.h + '%'
   styles.hand_rect.left = handRect.x + '%'
   styles.hand_rect.top = handRect.y + '%'

   
  const hands_style = { ...styles.hand_rect }
  return hands_style
}


const SignifyCamera = ({style = styles.camera,frameProcessorFps = 3,
    frameMaxSize = 250,frameQuality = 30,DetectModel = {detect_hands},onDetection }) => {

  const [cameraPermission, setCameraPermission] = useState(false);
  const [handRect, setHandsRect] = useState(UN_DETECTED_HANDS)

  hands_style = useMemo(() => {
    return create_hands_style(handRect,style);

  }, [handRect])
 // console.log('in signify render');

  useEffect(() => {
    check_premessions_interval = setInterval(() => { check_request_camera_premession(setCameraPermission) }, 1000)
    check_request_camera_premession(setCameraPermission);
    return () => {
      clearInterval(check_premessions_interval)
    }
  }, [])

  const upload_img = useCallback( async (img) => {
    let detect_res ;
    try {
        detect_res = await DetectModel.detect_hands(img);
      if (detect_res.stable)
        setHandsRect(detect_res);
    }
    catch (err) {
      console.log(err);
      setHandsRect(UN_DETECTED_HANDS);
      detect_res = UN_DETECTED_HANDS;
    }
    if(onDetection)
       onDetection(detect_res);
  },)

 
  
  return <View style={styles.container} >
     {!cameraPermission && <Text>Please Allow Camera Premitions</Text>}
     { cameraPermission && <View style={styles.container} >
     <Base64Camera  handle_frame={upload_img} 
     handsOk = {handRect.detected}
    style={style} 
    frameProcessorFps={frameProcessorFps} 
    frameMaxSize={frameMaxSize} frameQuality={frameQuality} />
    {handRect.detected 
    && <View style={hands_style} ></View>
    }
  </View>
   }
  </View>

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera:
  {
    position: 'absolute',
    top: '0%',
    left: '0%',
    width: '100%',
    height: '100%',
  },
  hand_rect: {
    left: 0,
    top: 0,
    borderWidth: 4,
    width: 0,
    height: 0,
    borderColor: 'green',
    position: 'absolute',
  },
  
});

export default SignifyCamera;
