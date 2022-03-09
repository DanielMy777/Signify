import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Image } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { HttpMethod, http_method } from './src/httpClient'
import Base64Camera from './components/Base64Camera';
import { ip } from './secrets'
function create_hands_style(handRect) {

  styles.hand_rect.width = handRect.width + '%';
  styles.hand_rect.height = handRect.height + '%'
  styles.hand_rect.left = handRect.x + '%'
  styles.hand_rect.top = handRect.y + '%'
  const hands_style = { ...styles.hand_rect }
  return hands_style
}

const App = () => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [handRect, setHandsRect] = useState({ "detected": false })

  hands_style = useMemo(() => {
    return create_hands_style(handRect);
  }, [handRect])



  useEffect(() => {

    const check_premessions = async () => {

      let cameraPermission = await Camera.getCameraPermissionStatus()
      if (cameraPermission != 'authorized') {
        setCameraPermission(false);
        cameraPermission = await Camera.requestCameraPermission()
      }
      setCameraPermission(cameraPermission == 'authorized');
    };
    intrval = setInterval(check_premessions, 1000)
    check_premessions();
    return () => {
      clearInterval(intrval)
    }
  }, [])



  const upload_img = async (img) => {
    try {

      res = await http_method(`http://${ip}:2718/api/img`, HttpMethod.POST, { img: img }, 2000);
      //  setHandsRect(res);
    }
    catch (err) {
      //setHandsRect({ "detected": false })
    }

  };

  if (cameraPermission != true) {
    return <View >
      <Text>Signify</Text>
    </View>
  }

  return <View style={styles.container}>
    <Base64Camera handle_frame={upload_img} style={styles.camera} frameProcessorFps={8} />
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
