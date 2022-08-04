import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Reanimated, {useSharedValue, runOnJS} from 'react-native-reanimated';
import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
  sortFormats,
} from 'react-native-vision-camera';
import Orientation from 'react-native-orientation-locker';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {PressableOpacity} from 'react-native-pressable-opacity';
import {normal_rotation_obj} from '../../Utils/frame-rotation';
import FontName from '../General/FontName';

function scanQRCodes(
  frame,
  orientation,
  isFrontDevice,
  frameMaxSize,
  quality,
  rotation_degree,
) {
  'worklet';
  return __scanQRCodes(
    frame,
    orientation,
    isFrontDevice,
    frameMaxSize,
    quality,
    rotation_degree,
  );
}

const Base64Camera = React.forwardRef(
  (
    {
      handle_frame,
      frameProcessorFps = 8,
      style = styles.default_camera_style,
      frameMaxSize,
      frameQuality,
      handsOk = false,
      rotationObject = normal_rotation_obj,
      rightMaterialIconsButtons,
      rightButtonsSize = 40,
    },
    ref,
  ) => {
    const [frontCamera, setFrontCamera] = useState(true);
    const orientation_obj = useSharedValue('null');
    const isFrontCamera = useSharedValue(true);
    useEffect(() => {
      const update_orientation = value => {
        orientation_obj.value = value;
      };
      Orientation.getDeviceOrientation(update_orientation);
      Orientation.addDeviceOrientationListener(update_orientation);
      return () => {
        Orientation.removeDeviceOrientationListener(update_orientation);
      };
    }, []);
    const flipCamera = () => {
      setFrontCamera(!frontCamera);
      isFrontCamera.value = !isFrontCamera.value;
    };

    const convert_button_icon_obj_to_element = (icon_button, index) => {
      return (
        <PressableOpacity
          style={styles.button}
          onPress={icon_button.onPress}
          key={index}>
          <MaterialCommunityIcons
            name={icon_button.name}
            color={icon_button.color ? icon_button.color : 'black'}
            size={rightButtonsSize}
          />
        </PressableOpacity>
      );
    };

    const frameProcessor = useFrameProcessor(
      async frame => {
        'worklet';

        const camera_orienation =
          (isFrontCamera.value ? 'selfie_' : '') +
          orientation_obj.value.toLocaleLowerCase();
        //console.log(camera_orienation);
        const rotatation_degree = rotationObject[camera_orienation];
        if (!rotatation_degree)
          rotatation_degree =
            rotationObject[orientation_obj.value.toLocaleLowerCase()];

        if (!rotatation_degree) rotatation_degree = 0;

        let base64_img = scanQRCodes(
          frame,
          orientation_obj.value,
          isFrontCamera.value,
          frameMaxSize,
          frameQuality,
          rotatation_degree,
        );
        if (handle_frame) {
          runOnJS(handle_frame)(base64_img);
        }
      },
      [orientation_obj, frameMaxSize, frameQuality, rotationObject],
    );

    const devices = useCameraDevices();
    const device = frontCamera ? devices.front : devices.back;

    const formats =
      device && device.formats ? device.formats.sort(sortFormats) : [];

    if (device == null) {
      console.log('device is null');
    }
    if (device == null) {
      return <View></View>;
    }

    return (
      <View style={{...styles.container, ...style}}>
        <Camera
          style={styles.default_camera_style}
          device={device}
          isActive={true}
          ref={ref}
          frameProcessor={frameProcessor}
          hdr={true}
          frameProcessorFps={frameProcessorFps}
        />

        <View style={styles.rightButtons}>
          <PressableOpacity
            style={styles.button}
            disabledOpacity={0.4}
            onPress={flipCamera}>
            <IonIcon
              name="camera-reverse"
              color="black"
              size={rightButtonsSize}
            />
          </PressableOpacity>

          {rightMaterialIconsButtons &&
            rightMaterialIconsButtons.map((icon_button, index) =>
              convert_button_icon_obj_to_element(icon_button, index),
            )}
          {handsOk && (
            <View style={{...styles.button, backgroundColor: '#00ff7e'}}>
              <MaterialCommunityIcons
                name="hand-okay"
                size={rightButtonsSize}
                color="black"
              />
            </View>
          )}
        </View>
      </View>
    );
  },
);

const CONTENT_SPACING = 10;
const BUTTON_SIZE = 45;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'yellow',
  },
  default_camera_style: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  button: {
    marginBottom: CONTENT_SPACING,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //'rgba(140, 140, 140, 0.8)'
  rightButtons: {
    position: 'absolute',
    top: '5%',
    right: '2%',
    zIndex: 2,
  },
  rightButtonText: {
    color: 'black',
    fontSize: 25,
  },
});

export default Base64Camera;
