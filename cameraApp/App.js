import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Image } from 'react-native';
import Base64Camera from './components/Base64Camera';
import { check_request_camera_premession } from './src/premessions'
import { detect_hands, UN_DETECTED_HANDS } from './src/detectionModel'
function create_hands_style(handRect) {

  styles.hand_rect.width = handRect.w + '%';
  styles.hand_rect.height = handRect.h + '%'
  styles.hand_rect.left = handRect.x + '%'
  styles.hand_rect.top = handRect.y + '%'
  const hands_style = { ...styles.hand_rect }
  return hands_style
}

const App = () => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [handRect, setHandsRect] = useState(UN_DETECTED_HANDS)

  hands_style = useMemo(() => {
    return create_hands_style(handRect);

  }, [handRect])


  useEffect(() => {
    check_premessions_interval = setInterval(() => { check_request_camera_premession(setCameraPermission) }, 1000)
    check_request_camera_premession(setCameraPermission);
    return () => {
      clearInterval(check_premessions_interval)
    }
  }, [])

  const upload_img = async (img) => {
    try {
      hands_rect = await detect_hands(img);

      if (hands_rect.stable)
        setHandsRect(hands_rect);
    }
    catch (err) {
      console.log(err);
      setHandsRect(UN_DETECTED_HANDS);
    }
  };

  if (cameraPermission != true) {
    return <View >
      <Text>Signify</Text>
    </View>
  }

  return <View style={styles.container}>
    <Base64Camera handle_frame={upload_img} style={styles.camera} frameProcessorFps={6} frameMaxSize={300} frameQuality={50} />
    {handRect.detected && <View style={hands_style} ></View>}
  </View>

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera:
  {
    position: 'absolute',
    top: 0,
    left: 0,
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
  }
});

export default App;
