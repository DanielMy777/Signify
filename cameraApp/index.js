/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {LogBox} from 'react-native';
LogBox.ignoreLogs([
  'new NativeEventEmitter',
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]); //
LogBox.ignoreAllLogs(); //Ignore all log notifications

AppRegistry.registerComponent(appName, () => App);
