import {Camera} from 'react-native-vision-camera';
import {Linking} from 'react-native';
class CameraPremession {
  static AUTHORIZED = 'authorized';
  static DENIED = 'denied';
}

const check_request_camera_premession = async setCameraPermission => {
  let cameraPermission = await Camera.getCameraPermissionStatus();
  if (cameraPermission != CameraPremession.AUTHORIZED) {
    setCameraPermission(false);
    cameraPermission = await Camera.requestCameraPermission();
  }
  setCameraPermission(cameraPermission == CameraPremession.AUTHORIZED);
};

const request_camera_premession = async () => {
  cameraPermission = await Camera.requestCameraPermission();
  if (cameraPermission == CameraPremession.DENIED) {
    await Linking.openSettings();
  }
};

module.exports = {
  check_request_camera_premession: check_request_camera_premession,
  request_camera_premession,
  CameraPremession,
};
