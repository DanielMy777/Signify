/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useMemo, useRef} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import Reanimated, {useSharedValue, runOnJS} from 'react-native-reanimated';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
  Frame,
  sortFormats,
} from 'react-native-vision-camera';
import {HttpMethod, http_method} from './src/httpClient';
import Orientation from 'react-native-orientation-locker';

function scanQRCodes(frame, orientation, isFrontDevice) {
  'worklet';
  return __scanQRCodes(frame, orientation, isFrontDevice);
}

const App = () => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [frontCamera, setFrontCamera] = useState(true);
  const orientation_obj = useSharedValue('null');
  const first_obj = useSharedValue(true);
  const isFrontCamera = useSharedValue(true);

  const wtf = useSharedValue({
    ok: true,
    m: () => {
      console.log('sup');
    },
  });

  useEffect(() => {
    const check_premessions = async () => {
      Orientation.getOrientation(value => {
        orientation_obj.value = value;
      });
      let cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission != 'authorized') {
        setCameraPermission(false);
        cameraPermission = await Camera.requestCameraPermission();
      }
      setCameraPermission(cameraPermission == 'authorized');
    };
    intrval = setInterval(check_premessions, 1000);
    //check_premessions();
    const update_orientation = value => {
      orientation_obj.value = value;
    };
    Orientation.addOrientationListener(update_orientation);
    return () => {
      clearInterval(intrval);
      Orientation.removeOrientationListener(update_orientation);
    };
  });

  const fps = useMemo(() => {
    return 30;
  });

  const upload_img = async img => {
    try {
      res = await http_method(
        'http://192.168.1.125:2718/api/img',
        HttpMethod.POST,
        {img: img},
      );
      console.log(res);
    } catch (err) {
      console.log('error upload_img:');
      console.log(err);
    }
  };

  const frameProcessor = useFrameProcessor(
    async frame => {
      'worklet';

      let base64_img = scanQRCodes(
        frame,
        orientation_obj.value,
        isFrontCamera.value ? 'yes' : 'false',
      );
      // console.log(orientation_obj.value);
      runOnJS(upload_img)(base64_img);

      if (first_obj.value) {
        first_obj.value = false;
        //  runOnJS(upload_img)(base64_img);
      }
    },
    [first_obj, orientation_obj],
  );

  const devices = useCameraDevices();
  const device = frontCamera ? devices.front : devices.back;

  if (device == null) {
    console.log('device is null');
  }
  if (device == null || cameraPermission != true) {
    return (
      <View>
        <Text>please allow camera premession</Text>
      </View>
    );
  }

  const formats = device.formats ? device.formats.sort(sortFormats) : [];

  // console.log('device supports night boost ', device.supportsLowLightBoost);

  const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
  return (
    <View style={styles.container}>
      <ReanimatedCamera
        style={styles.camera}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        hdr={true}
        frameProcessorFps={1}
      />
      <Button
        title="flip camera"
        styles={styles.button}
        onPress={() => {
          setFrontCamera(!frontCamera);
          isFrontCamera.value = !isFrontCamera.value;
        }}
      />
      <Text style={styles.text}>
        {' '}
        {frontCamera ? 'detected Or' : 'detected Screen'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: 'red',
  },
  text: {
    position: 'absolute',
    bottom: '5%',
    fontSize: 30,
    backgroundColor: 'red',
    width: '100%',
    textAlign: 'center',
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: '10%',
    right: 0,
  },
});

export default App;
