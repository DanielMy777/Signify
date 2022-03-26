import { Camera } from 'react-native-vision-camera';
const check_request_camera_premession = async (setCameraPermission) => {
    let cameraPermission = await Camera.getCameraPermissionStatus()
    if (cameraPermission != 'authorized') {
        setCameraPermission(false);
        cameraPermission = await Camera.requestCameraPermission()
    }
    setCameraPermission(cameraPermission == 'authorized');
};

module.exports = { check_request_camera_premession: check_request_camera_premession }