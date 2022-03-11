import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View, Button, Dimensions, Image } from 'react-native';
import Reanimated, { useSharedValue, runOnJS } from 'react-native-reanimated'
import { Camera, useCameraDevices, useFrameProcessor, Frame, sortFormats, frameRateIncluded } from 'react-native-vision-camera';
import Orientation from 'react-native-orientation-locker'
import IonIcon from 'react-native-vector-icons/Ionicons';
import { PressableOpacity } from 'react-native-pressable-opacity';

function scanQRCodes(frame, orientation, isFrontDevice, frameMaxSize, quality) {
    'worklet'
    return __scanQRCodes(frame, orientation, isFrontDevice, frameMaxSize, quality)
}

const Base64Camera = ({ handle_frame, frameProcessorFps = 8, style = styles.default_camera_style, frameMaxSize, frameQuality }) => {

    const [frontCamera, setFrontCamera] = useState(true);
    const orientation_obj = useSharedValue('null');
    const isFrontCamera = useSharedValue(true);

    useEffect(() => {
        const update_orientation = (value) => { orientation_obj.value = value; }
        Orientation.getOrientation(update_orientation);
        Orientation.addOrientationListener(update_orientation);
        return () => {
            Orientation.removeOrientationListener(update_orientation);
        }

    }, [])
    const flipCamera = () => {

        setFrontCamera(!frontCamera);
        isFrontCamera.value = !isFrontCamera.value
    }

    const frameProcessor = useFrameProcessor(async (frame) => {
        'worklet'
        let base64_img = scanQRCodes(frame, orientation_obj.value, isFrontCamera.value, frameMaxSize, frameQuality);
        if (handle_frame) {
            runOnJS(handle_frame)(base64_img)
        }
    }, [orientation_obj, frameMaxSize, frameQuality])

    const devices = useCameraDevices();
    const device = frontCamera ? devices.front : devices.back;

    const formats = device && device.formats ? device.formats.sort(sortFormats) : []

    if (device == null) {
        console.log('device is null');
    }
    if (device == null) {
        return <View></View>
    }

    return (
        <View style={styles.container}>

            <Camera
                style={style}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
                hdr={true}
                frameProcessorFps={frameProcessorFps}
            />

            <View style={styles.rightButtons}>
                <PressableOpacity style={styles.button} disabledOpacity={0.4} onPress={flipCamera}>
                    <IonIcon name="camera-reverse" color="white" size={40} />
                </PressableOpacity>
            </View>

        </View>

    )
}

const CONTENT_SPACING = 15
const BUTTON_SIZE = 40
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    default_camera_style:
    {
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
        backgroundColor: 'rgba(140, 140, 140, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightButtons: {
        position: 'absolute',
        top: '5%',
        right: '5%',
        zIndex: 2
    }
});

export default Base64Camera
