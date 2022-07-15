import {useEffect, useState} from 'react';
import {Keyboard} from 'react-native';
import Orientation from 'react-native-orientation-locker';

useKeyBoardOpen = () => {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOpen(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOpen(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardOpen;
};

useDeviceOrientation = () => {
  const [deviceOrientation, setDeviceOrientation] = useState('unknown');
  useEffect(() => {
    Orientation.getDeviceOrientation(setDeviceOrientation);
    Orientation.addDeviceOrientationListener(setDeviceOrientation);
    return () => {
      Orientation.removeDeviceOrientationListener(setDeviceOrientation);
    };
  }, []);
  return deviceOrientation.toLowerCase();
};

module.exports = {useKeyBoardOpen, useDeviceOrientation};
